import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import { v4 as uuidv4 } from "uuid";
import { cloudinary } from "@/lib/cloudinary";
import path from "path";

export const runtime = "nodejs";

const uploadToCloudinary = (fileBuffer, folderId, fileName) => {
    return new Promise((resolve, reject) => {
        const lastDotIndex = fileName.lastIndexOf('.');
        const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";
        const nameWithoutExtension = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
        const cleanName = sanitizeFilename(nameWithoutExtension).replace(/\./g, "_");
        const uniqueName = `${uuidv4()}-${cleanName}${extension}`;

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `investor_portal/folder_${folderId}`,
                public_id: uniqueName,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};


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

        // Save files
        for (const file of uploadedFiles) {

            if (!file || file.size === 0) {
                continue;
            }

            const bytes =
                await file.arrayBuffer();

            const buffer =
                Buffer.from(bytes);

            // Upload to Cloudinary
            const cloudinaryResult = await uploadToCloudinary(buffer, folderId, file.name);

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
                        cloudinaryResult.secure_url,
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
