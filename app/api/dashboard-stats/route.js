import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import Category from "@/models/Category";
import Folder from "@/models/Folder";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {

    try {

        await connectDB();

        const [totalCategories, totalFolders, totalFiles] =
            await Promise.all([
                Category.countDocuments(),
                Folder.countDocuments(),
                FileModel.countDocuments()
            ]);

        return json({
            totalCategories,
            totalFolders,
            totalFiles
        });

    } catch (error) {
        return errorResponse(error);
    }
}
