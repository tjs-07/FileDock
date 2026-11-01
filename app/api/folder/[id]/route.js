import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { serializeFolder } from "@/lib/serialize";
import { collectFolderIds, deleteFoldersWithFiles } from "@/lib/folder-tree";
import Folder from "@/models/Folder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () =>
    json({ success: false, message: "Folder not found" }, 404);

// DELETE FOLDER (with subfolders and files)
export async function DELETE(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) return notFound();

        const folder = await Folder.exists({ _id: id });

        if (!folder) return notFound();

        const folderIds = await collectFolderIds([id]);

        await deleteFoldersWithFiles(folderIds);

        return json({
            success: true,
            message: "Folder Deleted"
        });

    } catch (error) {
        return errorResponse(error);
    }
}

// RENAME FOLDER
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
                message: "Folder name is required"
            }, 400);
        }

        const folder = await Folder.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        ).lean();

        if (!folder) return notFound();

        return json({
            success: true,
            data: serializeFolder(folder)
        });

    } catch (error) {
        return errorResponse(error);
    }
}
