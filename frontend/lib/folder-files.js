import { getPublicFileUrl } from "@/lib/cloudinary-file-view";

function toObject(value) {
    return typeof value?.toObject === "function"
        ? value.toObject()
        : value;
}

export function serializeFolderFile(file, folder, request) {
    const data = toObject(file);
    const folderData = toObject(folder);
    const categoryData = toObject(folderData.categoryId);
    const viewUrl = data.publicId
        ? getPublicFileUrl(data, request)
        : data.fileUrl;

    return {
        ...data,
        fileUrl: viewUrl,
        viewUrl,
        folderId: {
            _id: folderData._id,
            name: folderData.name,
            categoryId: categoryData
        }
    };
}

export function serializeFolderFiles(folder, request) {
    return (folder.files || []).map((file) =>
        serializeFolderFile(file, folder, request)
    );
}

export function findFolderFile(folder, fileId) {
    return typeof folder.files?.id === "function"
        ? folder.files.id(fileId)
        : folder.files?.find((file) => file._id?.toString() === fileId);
}
