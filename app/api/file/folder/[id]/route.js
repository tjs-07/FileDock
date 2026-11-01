import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import {
    getCategoryNames,
    serializeFile,
    serializeFolder
} from "@/lib/serialize";
import Folder from "@/models/Folder";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET A FOLDER WITH BREADCRUMBS, SUBFOLDERS AND FILES
export async function GET(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        const notFound = () =>
            json({ success: false, message: "Folder not found" }, 404);

        if (!mongoose.isValidObjectId(id)) return notFound();

        const folder = await Folder.findById(id).lean();

        if (!folder) return notFound();

        const categoryNames = await getCategoryNames([folder]);
        const categoryName = categoryNames[folder.categoryId?.toString()] ?? null;

        // Breadcrumbs: walk up through parents
        const breadcrumbs = [];
        let current = folder;
        const seen = new Set();

        while (current && !seen.has(current._id.toString())) {

            seen.add(current._id.toString());

            breadcrumbs.unshift({
                id: current._id.toString(),
                name: current.name,
                category_id: current.categoryId?.toString() ?? null,
                category_name: categoryName
            });

            current = current.parentFolderId
                ? await Folder.findById(current.parentFolderId).lean()
                : null;
        }

        const subFolders = await Folder.find({ parentFolderId: id })
            .sort({ createdAt: -1 })
            .lean();

        const files = await FileModel.find({ folderId: id })
            .sort({ createdAt: -1 })
            .lean();

        return json({
            success: true,
            data: {
                folder: serializeFolder(folder, categoryName),
                breadcrumbs,
                subFolders: subFolders.map((item) =>
                    serializeFolder(item, categoryName)
                ),
                files: files.map((file) => serializeFile(file))
            }
        });

    } catch (error) {
        return errorResponse(error);
    }
}
