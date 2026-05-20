import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import Folder from "@/models/Folder";
import { cloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";


export const runtime = "nodejs";

export async function DELETE(_request, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                message: "Invalid folder id"
            }, 400);
        }

        const folder = await Folder.findById(id);

        if (!folder) {
            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        await Promise.all(
            (folder.files || [])
                .filter((file) => file.publicId)
                .map((file) =>
                    cloudinary.uploader.destroy(
                        file.publicId,
                        {
                            resource_type: file.resourceType || "raw"
                        }
                    )
                )
        );

        await Folder.findByIdAndDelete(id);

        return json({
            success: true,
            message: "Folder Deleted"
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                message: "Invalid folder id"
            }, 400);
        }

        const body = await request.json();
        const name = body.name?.trim();

        if (!name) {
            return json({
                success: false,
                message: "Folder name is required"
            }, 400);
        }

        const updatedFolder =
            await Folder.findByIdAndUpdate(
                id,
                {
                    name
                },
                {
                    new: true
                }
            );

        if (!updatedFolder) {
            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        return json({
            success: true,
            data: updatedFolder
        });

    } catch (error) {

        return errorResponse(error);

    }

}
