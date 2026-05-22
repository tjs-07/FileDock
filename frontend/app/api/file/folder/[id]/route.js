import db from "@/lib/db";

import {
    json,
    errorResponse
} from "@/lib/api-response";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";





export async function GET(request, context) {

    try {

        const { id } = await context.params;

        // Get folder + category
        const [folderRows] = await db.query(

            `SELECT
                folders.*,
                categories.name AS category_name
             FROM folders
             LEFT JOIN categories
             ON folders.category_id = categories.id
             WHERE folders.id = ?`,

            [id]
        );

        const folder = folderRows[0];

        // Folder not found
        if (!folder) {

            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        // Get subfolders
        const [subFolders] = await db.query(

            `SELECT *
             FROM folders
             WHERE parent_folder_id = ?
             ORDER BY created_at DESC`,

            [id]
        );

        // Get files
        const [files] = await db.query(

            `SELECT *
             FROM files
             WHERE folder_id = ?
             ORDER BY created_at DESC`,

            [id]
        );

        return json({

            success: true,

            data: {

                folder,

                subFolders,

                files
            }
        });

    } catch (error) {

        return errorResponse(error);

    }

}
