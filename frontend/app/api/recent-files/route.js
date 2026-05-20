import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import Category from "@/models/Category";
import Folder from "@/models/Folder";
import { serializeFolderFile } from "@/lib/folder-files";

export const runtime = "nodejs";

void Category;
void Folder;

export async function GET(request) {
    try {
        await connectDB();

        const folders = await Folder.find().populate("categoryId");
        const files = folders
            .flatMap((folder) =>
                (folder.files || []).map((file) =>
                    serializeFolderFile(file, folder, request)
                )
            )
            .sort((a, b) =>
                new Date(b.createdAt || b._id?.getTimestamp?.() || 0) -
                new Date(a.createdAt || a._id?.getTimestamp?.() || 0)
            );

        return json(files);
    } catch (error) {
        return errorResponse(error);
    }
}
