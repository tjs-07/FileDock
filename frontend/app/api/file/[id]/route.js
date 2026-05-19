import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";

import File from "@/models/Files";

import { cloudinary } from "@/lib/cloudinary";
import { streamFileInline } from "@/lib/cloudinary-file-view";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

        if (!file.publicId && file.fileUrl?.includes("onrender.com/uploads/")) {
            return json({
                success: false,
                message: "This file was uploaded before Cloudinary setup and the old upload URL is no longer available. Please re-upload this file."
            }, 410);
        }

        const response = await streamFileInline(file);

        if (response.error) {
            return json({
                success: false,
                message: file.publicId
                    ? "Unable to load file from Cloudinary"
                    : "Unable to load legacy file URL. Please re-upload this file."
            }, response.status);
        }

        return response;

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
