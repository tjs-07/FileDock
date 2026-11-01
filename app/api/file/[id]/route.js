import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { serializeFile } from "@/lib/serialize";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () =>
    json({ success: false, message: "File not found" }, 404);

// GET ONE FILE
export async function GET(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) return notFound();

        const file = await FileModel.findById(id).lean();

        if (!file) return notFound();

        return json({
            success: true,
            data: serializeFile(file)
        });

    } catch (error) {
        return errorResponse(error);
    }
}

// DELETE FILE
export async function DELETE(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) return notFound();

        const file = await FileModel.findById(id).lean();

        if (!file) return notFound();

        await deleteFromCloudinary([file]);

        await FileModel.deleteOne({ _id: id });

        return json({
            success: true,
            message: "File Deleted"
        });

    } catch (error) {
        return errorResponse(error);
    }
}
