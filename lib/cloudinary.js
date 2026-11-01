import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

function cleanName(name) {
    return name.replace(/[^a-zA-Z0-9.]/g, "_");
}

// One signed upload request. Returns { ok, status, data }.
// Using fetch (instead of the SDK's upload_stream) so Cloudinary's real
// error message is visible, not just "unexpected status code - 403".
async function signedUpload(resourceType, fileBuffer, fileName, mimeType, params) {

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Cloudinary keys are missing. Fill CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local and restart the server."
        );
    }

    const signedParams = {
        ...params,
        timestamp: Math.floor(Date.now() / 1000)
    };

    const signature = cloudinary.utils.api_sign_request(
        signedParams,
        apiSecret
    );

    const form = new FormData();

    form.append(
        "file",
        new Blob([fileBuffer], { type: mimeType || "application/octet-stream" }),
        fileName
    );

    for (const [key, value] of Object.entries(signedParams)) {
        form.append(key, String(value));
    }

    form.append("api_key", apiKey);
    form.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: form }
    );

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        data = { error: { message: text.slice(0, 200) } };
    }

    return { ok: response.ok && !data.error, status: response.status, data };
}

// Upload a file buffer to Cloudinary
export async function uploadToCloudinary(fileBuffer, folderId, fileName, mimeType) {

    const lastDot = fileName.lastIndexOf(".");
    const extension = lastDot !== -1 ? fileName.substring(lastDot) : "";
    const baseName = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
    const publicId = `${uuidv4()}-${cleanName(baseName).replace(/\./g, "_")}${extension}`;

    const params = {
        folder: `investor_portal/folder_${folderId}`,
        public_id: publicId
    };

    // 1st try: let Cloudinary pick the type (image/video/raw)
    let result = await signedUpload("auto", fileBuffer, fileName, mimeType, params);

    // 403 = Cloudinary refused this type as an image -> retry as a raw file
    if (!result.ok && result.status === 403) {
        const firstMessage = result.data?.error?.message;

        result = await signedUpload("raw", fileBuffer, fileName, mimeType, params);

        if (!result.ok && firstMessage) {
            result.data.error.message += ` (first attempt: ${firstMessage})`;
        }
    }

    if (!result.ok) {
        const message = result.data?.error?.message || `HTTP ${result.status}`;

        console.log("Cloudinary upload failed:", result.status, message);

        throw new Error(`Cloudinary error ${result.status}: ${message}`);
    }

    return result.data;
}

// Best-effort delete from Cloudinary (never throws)
export async function deleteFromCloudinary(files) {

    for (const file of files) {

        if (!file.publicId) continue;

        try {
            await cloudinary.uploader.destroy(file.publicId, {
                resource_type: file.resourceType || "image"
            });
        } catch (error) {
            console.log("Cloudinary delete failed:", error.message);
        }
    }
}

export { cloudinary };