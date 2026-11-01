import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { serializeCategory } from "@/lib/serialize";
import { collectFolderIds, deleteFoldersWithFiles } from "@/lib/folder-tree";
import Category from "@/models/Category";
import Folder from "@/models/Folder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () =>
    json({ success: false, message: "Category not found" }, 404);

// DELETE CATEGORY (with its folders and files)
export async function DELETE(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) return notFound();

        const category = await Category.findById(id);

        if (!category) return notFound();

        const folders = await Folder.find({ categoryId: id })
            .select("_id")
            .lean();

        const folderIds = await collectFolderIds(
            folders.map((folder) => folder._id)
        );

        await deleteFoldersWithFiles(folderIds);

        await category.deleteOne();

        return json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        return errorResponse(error);
    }
}

// UPDATE CATEGORY
export async function PUT(request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) return notFound();

        const body = await request.json();
        const name = body.name?.trim();

        if (!name) {
            return json({
                success: false,
                message: "Category name is required"
            }, 400);
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        ).lean();

        if (!category) return notFound();

        return json({
            success: true,
            data: serializeCategory(category)
        });

    } catch (error) {
        return errorResponse(error);
    }
}
