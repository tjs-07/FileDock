import path from "path";

export function sanitizePathPart(value) {
    return value
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "") || "folder";
}

export async function getFolderPathParts(db, folderId) {
    const parts = [];
    let currentFolderId = folderId;

    while (currentFolderId) {
        const [rows] = await db.query(
            `SELECT id, name, parent_folder_id
             FROM folders
             WHERE id = ?`,
            [currentFolderId]
        );

        const folder = rows[0];

        if (!folder) {
            break;
        }

        parts.unshift(
            `${folder.id}-${sanitizePathPart(folder.name)}`
        );

        currentFolderId = folder.parent_folder_id;
    }

    return parts;
}

export async function getFolderUploadTarget(db, folderId, filename) {
    const folderParts =
        await getFolderPathParts(db, folderId);

    const relativeParts = [
        "uploads",
        ...folderParts,
        filename
    ];

    return {
        directoryPath: path.join(
            process.cwd(),
            "public",
            "uploads",
            ...folderParts
        ),
        filePath: path.join(
            process.cwd(),
            "public",
            ...relativeParts
        ),
        fileUrl: `/${relativeParts.join("/")}`
    };
}
