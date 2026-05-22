import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";


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



export async function DELETE(req, context) {

    const connection = await db.getConnection();

    try {

        const { id } = await context.params;

        await connection.beginTransaction();

        const [categoryRows] = await connection.query(

            `SELECT *
             FROM categories
             WHERE id = ?`,

            [id]
        );

        if (!categoryRows[0]) {

            await connection.rollback();
            connection.release();

            return json({
                success: false,
                message: "Category not found"
            }, 404);
        }

        const [rootFolders] = await connection.query(

            `SELECT id
             FROM folders
             WHERE category_id = ?
             AND (
                parent_folder_id IS NULL
                OR parent_folder_id NOT IN (
                    SELECT id
                    FROM folders
                    WHERE category_id = ?
                )
             )`,

            [id, id]
        );

        const folderTree =
            await collectFolderTree(
                connection,
                rootFolders.map((folder) => folder.id)
            );

        const folderIds =
            folderTree.map((folder) => folder.id);

        if (folderIds.length > 0) {

            const placeholders =
                folderIds.map(() => "?").join(",");

            const [files] = await connection.query(

                `SELECT *
                 FROM files
                 WHERE folder_id IN (${placeholders})`,

                folderIds
            );

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

            for (const folder of folderTree) {

                await connection.query(

                    `DELETE FROM folders
                     WHERE id = ?`,

                    [folder.id]
                );

            }

        }

        // Delete category
        await connection.query(

            `DELETE FROM categories
             WHERE id = ?`,

            [id]
        );

        await connection.commit();
        connection.release();

        return json({
            success: true,
            message: "Category deleted successfully"
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

        const body = await request.json();

        const name = body.name?.trim();

        // Validation
        if (!name) {

            return json({
                success: false,
                message: "Category name is required"
            }, 400);
        }

        // Update category
        const [result] = await db.query(

            `UPDATE categories
             SET name = ?
             WHERE id = ?`,

            [name, id]
        );

        // No category found
        if (result.affectedRows === 0) {

            return json({
                success: false,
                message: "Category not found"
            }, 404);
        }

        // Fetch updated category
        const [updatedRows] = await db.query(

            `SELECT *
             FROM categories
             WHERE id = ?`,

            [id]
        );

        return json({
            success: true,
            data: updatedRows[0]
        });

    } catch (error) {

        return errorResponse(error);

    }

}
