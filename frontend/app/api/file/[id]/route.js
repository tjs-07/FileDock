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

        const response = await streamFileInline(file);

        if (response.error) {
            return json({
                success: false,
                message: "Unable to load file"
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
