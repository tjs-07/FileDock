import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import fs from "fs";
import path from "path";

import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";





function sanitizeFilename(name) {

    return name
        .replace(/[^a-zA-Z0-9.]/g, "_");

}






// GET FILES
export async function GET() {

    try {

        const [files] = await db.query(

            `SELECT
                files.*,
                folders.name AS folder_name
             FROM files
             LEFT JOIN folders
             ON files.folder_id = folders.id
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









// UPLOAD FILES
export async function POST(request) {

    try {

        const formData =
            await request.formData();

        const folderId =
            formData.get("folderId");

        const uploadedFiles =
            formData.getAll("files");

        // Check folder exists
        const [folderRows] =
            await db.query(

                `SELECT *
                 FROM folders
                 WHERE id = ?`,

                [folderId]
            );

        const folder = folderRows[0];

        if (!folder) {

            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        const savedFiles = [];

        // Upload path
        const uploadDir = path.join(

            process.cwd(),

            "public",

            "uploads"
        );

        // Create uploads folder
        if (!fs.existsSync(uploadDir)) {

            fs.mkdirSync(uploadDir, {
                recursive: true
            });
        }

        // Save files
        for (const file of uploadedFiles) {

            if (!file || file.size === 0) {
                continue;
            }

            const bytes =
                await file.arrayBuffer();

            const buffer =
                Buffer.from(bytes);

            // Unique filename
            const uniqueName =
                `${uuidv4()}-${sanitizeFilename(file.name)}`;

            const filePath =
                path.join(uploadDir, uniqueName);

            // Save physical file
            fs.writeFileSync(
                filePath,
                buffer
            );

            const fileUrl =
                `/uploads/${uniqueName}`;

            // Save DB record
            const [result] =
                await db.query(

                    `INSERT INTO files
                    (
                        name,
                        file_url,
                        folder_id
                    )
                    VALUES (?, ?, ?)`,

                    [
                        file.name,
                        fileUrl,
                        folderId
                    ]
                );

            // Get inserted file
            const [rows] =
                await db.query(

                    `SELECT *
                     FROM files
                     WHERE id = ?`,

                    [result.insertId]
                );

            savedFiles.push(rows[0]);

        }

        return json({
            success: true,
            data: savedFiles
        });

    } catch (error) {

        console.log(error);

        return errorResponse(error);

    }

}
