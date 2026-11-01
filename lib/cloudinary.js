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

// Upload a file buffer to Cloudinary
// Images are stored as "image"; everything else (pdf, docx, zip...) as "raw"
// so the URL opens/downloads correctly.
export function uploadToCloudinary(fileBuffer, folderId, fileName, mimeType = "") {

    return new Promise((resolve, reject) => {

        const lastDot = fileName.lastIndexOf(".");
        const extension = lastDot !== -1 ? fileName.substring(lastDot) : "";
        const baseName = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
        const safeBase = `${uuidv4()}-${cleanName(baseName).replace(/\./g, "_")}`;

        const isPdf = mimeType === "application/pdf";
        const isImage = mimeType.startsWith("image/") && !isPdf;

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `investor_portal/folder_${folderId}`,
                // images: no extension (Cloudinary adds the format)
                // raw files: extension must be part of public_id
                public_id: isImage ? safeBase : `${safeBase}${extension}`,
                resource_type: isImage ? "image" : "raw"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
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