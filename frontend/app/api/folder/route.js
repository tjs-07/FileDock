import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import fs from "fs";

import { v4 as uuidv4 } from "uuid";

import { getFolderUploadTarget } from "@/lib/folder-upload-path";

export const runtime = "nodejs";







function sanitizeFilename(name) {

    return name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
    );

}








// GET FOLDERS
export async function GET() {

    try {

        // Get folders + category
        const [folders] = await db.query(

            `SELECT
                folders.*,
                categories.name AS category_name
             FROM folders
             LEFT JOIN categories
             ON folders.category_id = categories.id
             WHERE folders.parent_folder_id IS NULL
             ORDER BY folders.created_at DESC`
        );

        // Add files to each folder
        const finalData =
            await Promise.all(

                folders.map(async (folder) => {

                    const [files] =
                        await db.query(

                            `SELECT *
                             FROM files
                             WHERE folder_id = ?`,

                            [folder.id]
                        );

                    return {
                        ...folder,
                        files
                    };

                })
            );

        return json({
            success: true,
            data: finalData
        });

    } catch (error) {

        return errorResponse(error);

    }

}












// CREATE FOLDER
export async function POST(request) {

    try {

        const formData =
            await request.formData();

        const name =
            formData.get("name")
                ?.toString()
                .trim();

        const rawCategoryId =
            formData.get("categoryId")
                ?.toString()
                .trim();

        const categoryId =
            rawCategoryId && /^\d+$/.test(rawCategoryId)
                ? Number(rawCategoryId)
                : null;

        const rawParentFolderId =
            formData.get("parentFolderId")
                ?.toString()
                .trim();

        const parentFolderId =
            rawParentFolderId && /^\d+$/.test(rawParentFolderId)
                ? Number(rawParentFolderId)
                : null;

        // Validation
        if (!name) {

            return json({
                success: false,
                message:
                    "Folder name is required"
            }, 400);
        }

        if (!categoryId) {

            return json({
                success: false,
                message:
                    "Category is required"
            }, 400);
        }

        // Create folder
        const [folderResult] =
            await db.query(

                `INSERT INTO folders
                (
                    name,
                    category_id,
                    parent_folder_id
                )
                VALUES (?, ?, ?)`,

                [
                    name,
                    categoryId,
                    parentFolderId
                ]
            );

        const folderId =
            folderResult.insertId;

        // Handle PDFs
        const pdfs =
            formData
                .getAll("pdfs")
                .filter(
                    (file) =>
                        file &&
                        file.size > 0
                );

        // Save files
        for (const file of pdfs) {

            const bytes =
                await file.arrayBuffer();

            const buffer =
                Buffer.from(bytes);

            // Unique filename
            const uniqueName =
                `${uuidv4()}-${sanitizeFilename(file.name)}`;

            const uploadTarget =
                await getFolderUploadTarget(
                    db,
                    folderId,
                    uniqueName
                );

            if (!fs.existsSync(uploadTarget.directoryPath)) {

                fs.mkdirSync(uploadTarget.directoryPath, {
                    recursive: true
                });
            }

            // Save physical file
            fs.writeFileSync(
                uploadTarget.filePath,
                buffer
            );

            // Save DB record
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
                    uploadTarget.fileUrl,
                    folderId
                ]
            );

        }

        // Fetch created folder
        const [rows] =
            await db.query(

                `SELECT *
                 FROM folders
                 WHERE id = ?`,

                [folderId]
            );

        return json({

            success: true,

            message: "Folder Added",

            data: rows[0]

        });

    } catch (error) {

        return errorResponse(error);

    }

}
