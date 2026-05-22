import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

export const runtime = "nodejs";






export async function GET() {

    try {

        // Get all files with folder + category info
        const [files] = await db.query(

            `SELECT

                files.*,

                folders.name AS folder_name,

                categories.name AS category_name

             FROM files

             LEFT JOIN folders
             ON files.folder_id = folders.id

             LEFT JOIN categories
             ON folders.category_id = categories.id

             ORDER BY files.created_at DESC`
        );

        return json({
            success: true,
            data: files
        });

    } catch (error) {

        return errorResponse(error);

    }

}