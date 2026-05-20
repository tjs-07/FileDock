import { cloudinary } from "@/lib/cloudinary";

function contentDispositionFilename(filename) {
    return filename.replace(/["\\]/g, "");
}

function getFileExtension(filename) {
    const extension = filename.split(".").pop();

    return extension && extension !== filename
        ? extension.toLowerCase().replace(/[^a-z0-9]/g, "")
        : undefined;
}

function getCloudinaryViewUrl(file) {
    if ((file.resourceType || "raw") === "raw" && file.publicId) {
        return cloudinary.utils.private_download_url(
            file.publicId,
            getFileExtension(file.title),
            {
                resource_type: "raw",
                type: "upload",
                attachment: false,
                expires_at: Math.floor(Date.now() / 1000) + 300
            }
        );
    }

    return file.fileUrl;
}

export function getPublicFilePath(file) {
    return file.publicId
        ? `/${file.publicId.split("/").map(encodeURIComponent).join("/")}`
        : `/api/file/${file._id}`;
}

export function getPublicFileUrl(file, request) {
    const path = getPublicFilePath(file);

    if (request?.url) {
        return new URL(path, request.url).toString();
    }

    return path;
}

export function serializeFileForClient(file, request) {
    const data = typeof file.toObject === "function"
        ? file.toObject()
        : file;

    const viewUrl = data.publicId
        ? getPublicFileUrl(data, request)
        : data.fileUrl;

    return {
        ...data,
        fileUrl: viewUrl,
        viewUrl
    };
}

export async function streamFileInline(file) {
    const viewUrl = getCloudinaryViewUrl(file);
    const cloudinaryResponse = await fetch(viewUrl);

    if (!cloudinaryResponse.ok || !cloudinaryResponse.body) {
        return {
            error: true,
            status: cloudinaryResponse.status || 502
        };
    }

    return new Response(cloudinaryResponse.body, {
        status: 200,
        headers: {
            "Content-Type": file.fileType || cloudinaryResponse.headers.get("content-type") || "application/octet-stream",
            "Content-Disposition": `inline; filename="${contentDispositionFilename(file.title)}"`,
            "Cache-Control": "private, no-store"
        }
    });
}
