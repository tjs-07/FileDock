import Category from "@/models/Category";

// The frontend expects `id` + snake_case fields, so shape Mongo docs that way.

export function serializeCategory(category) {

    return {
        id: category._id.toString(),
        _id: category._id.toString(),
        name: category.name,
        created_at: category.createdAt,
        updated_at: category.updatedAt
    };
}

export function serializeFolder(folder, categoryName = null) {

    return {
        id: folder._id.toString(),
        _id: folder._id.toString(),
        name: folder.name,
        category_id: folder.categoryId ? folder.categoryId.toString() : null,
        category_name: categoryName,
        parent_folder_id: folder.parentFolderId
            ? folder.parentFolderId.toString()
            : null,
        created_at: folder.createdAt,
        updated_at: folder.updatedAt
    };
}

export function serializeFile(file, extra = {}) {

    return {
        id: file._id.toString(),
        _id: file._id.toString(),
        name: file.name,
        file_url: file.fileUrl,
        fileUrl: file.fileUrl,
        publicId: file.publicId,
        resource_type: file.resourceType,
        file_type: file.fileType,
        size: file.size,
        folder_id: file.folderId ? file.folderId.toString() : null,
        created_at: file.createdAt,
        updated_at: file.updatedAt,
        ...extra
    };
}

// Returns { categoryId: name } for a list of folders
export async function getCategoryNames(folders) {

    const ids = [
        ...new Set(
            folders
                .map((folder) => folder.categoryId?.toString())
                .filter(Boolean)
        )
    ];

    if (ids.length === 0) return {};

    const categories = await Category.find({ _id: { $in: ids } }).lean();

    return Object.fromEntries(
        categories.map((item) => [item._id.toString(), item.name])
    );
}
