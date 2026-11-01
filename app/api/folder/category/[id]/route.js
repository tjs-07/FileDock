import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { getCategoryNames, serializeFolder } from "@/lib/serialize";
import Folder from "@/models/Folder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET TOP-LEVEL FOLDERS OF A CATEGORY
export async function GET(_request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.isValidObjectId(id)) {
            return json({ success: true, data: [] });
        }

        const folders = await Folder.find({
            categoryId: id,
            parentFolderId: null
        })
            .sort({ createdAt: -1 })
            .lean();

        const categoryNames = await getCategoryNames(folders);

        return json({
            success: true,
            data: folders.map((folder) =>
                serializeFolder(
                    folder,
                    categoryNames[folder.categoryId?.toString()] ?? null
                )
            )
        });

    } catch (error) {
        return errorResponse(error);
    }
}
