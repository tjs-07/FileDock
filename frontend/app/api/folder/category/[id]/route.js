import db from "@/lib/db";

import {
    NextResponse
} from "next/server";

export const runtime = "nodejs";





export async function GET(request, context) {

    try {

        const { id } = await context.params;

        // Get folders by category
        const [folders] = await db.query(

            `SELECT
                folders.*,
                categories.name AS category_name
             FROM folders
             LEFT JOIN categories
             ON folders.category_id = categories.id
             WHERE folders.category_id = ?
             AND folders.parent_folder_id IS NULL
             ORDER BY folders.created_at DESC`,

            [id]
        );

        return NextResponse.json({
            success: true,
            data: folders
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message
        });

    }

}
