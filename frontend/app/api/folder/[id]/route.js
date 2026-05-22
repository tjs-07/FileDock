import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import fs from "fs";
import path from "path";

export const runtime = "nodejs";


function uploadPath(fileUrl) {
    return path.join(
        process.cwd(),
        "public",
        fileUrl.replace(/^\/+/, "")
    );
}


async function collectFolderTree(connection, rootIds) {
    const folderDepths = new Map();
    let currentIds = rootIds
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value));

    currentIds.forEach((folderId) => {
        folderDepths.set(folderId, 0);
    });

    while (currentIds.length > 0) {
        const placeholders = currentIds.map(() => "?").join(",");
        const [children] = await connection.query(
            `SELECT id, parent_folder_id
             FROM folders
             WHERE parent_folder_id IN (${placeholders})`,
            currentIds
        );

        const nextIds = [];

        children.forEach((child) => {
            const childId = Number(child.id);
            const parentDepth =
                folderDepths.get(Number(child.parent_folder_id)) || 0;

            if (!folderDepths.has(childId)) {
                folderDepths.set(childId, parentDepth + 1);
                nextIds.push(childId);
            }
        });

        currentIds = nextIds;
    }

    return [...folderDepths.entries()]
        .map(([id, depth]) => ({
            id,
            depth
        }))
        .sort((a, b) => b.depth - a.depth);
}






export async function DELETE(_request, context) {

    const connection = await db.getConnection();

    try {

        const { id } = await context.params;

        await connection.beginTransaction();

        // Find folder
        const [folderRows] = await connection.query(

            `SELECT *
             FROM folders
             WHERE id = ?`,

            [id]
        );

        const folder = folderRows[0];

        // Folder not found
        if (!folder) {

            await connection.rollback();
            connection.release();

            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        const folderTree =
            await collectFolderTree(connection, [id]);

        const folderIds =
            folderTree.map((item) => item.id);

        const placeholders =
            folderIds.map(() => "?").join(",");

        // Get files inside folder and child folders
        const [files] = await connection.query(

            `SELECT *
             FROM files
             WHERE folder_id IN (${placeholders})`,

            folderIds
        );

        // Delete physical files
        for (const file of files) {

            const filePath = uploadPath(file.file_url);

            if (fs.existsSync(filePath)) {

                fs.unlinkSync(filePath);

            }

        }

        await connection.query(

            `DELETE FROM files
             WHERE folder_id IN (${placeholders})`,

            folderIds
        );

        // Delete child folders before parents
        for (const folderItem of folderTree) {

            await connection.query(

                `DELETE FROM folders
                 WHERE id = ?`,

                [folderItem.id]
            );

        }

        await connection.commit();
        connection.release();

        return json({
            success: true,
            message: "Folder Deleted"
        });

    } catch (error) {

        await connection.rollback();
        connection.release();

        return errorResponse(error);

    }

}









export async function PUT(request, context) {

    try {

        const { id } = await context.params;

        const body =
            await request.json();

        const name =
            body.name?.trim();

        // Validation
        if (!name) {

            return json({
                success: false,
                message:
                    "Folder name is required"
            }, 400);
        }

        // Update folder
        const [result] =
            await db.query(

                `UPDATE folders
                 SET name = ?
                 WHERE id = ?`,

                [name, id]
            );

        // Folder not found
        if (result.affectedRows === 0) {

            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        // Fetch updated folder
        const [rows] =
            await db.query(

                `SELECT *
                 FROM folders
                 WHERE id = ?`,

                [id]
            );

        return json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        return errorResponse(error);

    }

}
