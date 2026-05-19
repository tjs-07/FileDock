import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";

import File from "@/models/Files";

import { cloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function GET(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                message: "Invalid file id"
            }, 400);
        }

        const file = await File.findById(id);

        if (!file) {
            return json({
                success: false,
                message: "File not found"
            }, 404);
        }

        const viewUrl = getCloudinaryViewUrl(file);

        const cloudinaryResponse = await fetch(viewUrl);

        if (!cloudinaryResponse.ok || !cloudinaryResponse.body) {
            return json({
                success: false,
                message: "Unable to load file"
            }, cloudinaryResponse.status || 502);
        }

        return new Response(cloudinaryResponse.body, {
            status: 200,
            headers: {
                "Content-Type": file.fileType || cloudinaryResponse.headers.get("content-type") || "application/octet-stream",
                "Content-Disposition": `inline; filename="${contentDispositionFilename(file.title)}"`,
                "Cache-Control": "private, no-store"
            }
        });

    } catch (error) {

        return errorResponse(error);

    }

}

export async function DELETE(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                message: "Invalid file id"
            }, 400);
        }

        const file = await File.findById(id);

        if (!file) {

            return json({
                success: false,
                message: "File not found"
            }, 404);

        }

        if (file.publicId) {
            // Delete Cloudinary File
            const result = await cloudinary.uploader.destroy(
                file.publicId,
                {
                    resource_type: file.resourceType || "raw"
                }
            );

            if (result.result !== "ok" && result.result !== "not found") {
                return json({
                    success: false,
                    message: "Cloudinary file was not deleted"
                }, 502);
            }
        }

        // Delete DB Entry
        await File.findByIdAndDelete(id);

        return json({
            success: true,
            message: "File Deleted"
        });

    } catch (error) {

        return errorResponse(error);

    }

}
