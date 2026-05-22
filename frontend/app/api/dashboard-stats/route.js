import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

export const runtime = "nodejs";



export async function GET() {

    try {

        // Total Categories
        const [categoryRows] = await db.query(

            `SELECT COUNT(*) AS totalCategories
             FROM categories`
        );

        // Total Folders
        const [folderRows] = await db.query(

            `SELECT COUNT(*) AS totalFolders
             FROM folders`
        );

        // Total Files
        const [fileRows] = await db.query(

            `SELECT COUNT(*) AS totalFiles
             FROM files`
        );

        return json({

            totalCategories:
                categoryRows[0].totalCategories,

            totalFolders:
                folderRows[0].totalFolders,

            totalFiles:
                fileRows[0].totalFiles
        });

    } catch (error) {

        return errorResponse(error);

    }

}