import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";





export async function GET(_request, context) {

    try {

        const { id } = await context.params;

        // Get file from DB
        const [rows] = await db.query(

            `SELECT *
             FROM files
             WHERE id = ?`,

            [id]
        );

        const file = rows[0];

        // File not found
        if (!file) {

            return json({
                success: false,
                message: "File not found"
            }, 404);
        }

        return json({
            success: true,
            data: file
        });

    } catch (error) {

        return errorResponse(error);

    }

}








export async function DELETE(_request, context) {

    try {

        const { id } = await context.params;

        // Find file
        const [rows] = await db.query(

            `SELECT *
             FROM files
             WHERE id = ?`,

            [id]
        );

        const file = rows[0];

        // File not found
        if (!file) {

            return json({
                success: false,
                message: "File not found"
            }, 404);

        }

        // Physical file path
        const filePath = path.join(

            process.cwd(),

            "public",

            file.file_url
        );

        // Delete physical file
        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }

        // Delete DB record
        await db.query(

            `DELETE FROM files
             WHERE id = ?`,

            [id]
        );

        return json({
            success: true,
            message: "File Deleted"
        });

    } catch (error) {

        return errorResponse(error);

    }

}
