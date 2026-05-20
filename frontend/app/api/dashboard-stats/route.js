import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import Category from "@/models/Category";
import Folder from "@/models/Folder";

export const runtime = "nodejs";

export async function GET() {
    try {
        await connectDB();

        const totalCategories = await Category.countDocuments();
        const totalFolders = await Folder.countDocuments();
        const fileStats = await Folder.aggregate([
            {
                $project: {
                    fileCount: {
                        $size: {
                            $ifNull: ["$files", []]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalFiles: {
                        $sum: "$fileCount"
                    }
                }
            }
        ]);
        const totalFiles = fileStats[0]?.totalFiles || 0;

        return json({
            totalCategories,
            totalFolders,
            totalFiles
        });
    } catch (error) {
        return errorResponse(error);
    }
}
