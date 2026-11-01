import Folder from "@/models/Folder";
import FileModel from "@/models/File";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// All folder ids under (and including) the given root ids
export async function collectFolderIds(rootIds) {

    const all = new Set(rootIds.map((id) => id.toString()));
    let current = [...all];

    while (current.length > 0) {

        const children = await Folder.find({
            parentFolderId: { $in: current }
        })
            .select("_id")
            .lean();

        current = [];

        for (const child of children) {
            const childId = child._id.toString();

            if (!all.has(childId)) {
                all.add(childId);
                current.push(childId);
            }
        }
    }

    return [...all];
}

// Delete folders + their files (DB and Cloudinary)
export async function deleteFoldersWithFiles(folderIds) {

    if (folderIds.length === 0) return;

    const files = await FileModel.find({
        folderId: { $in: folderIds }
    }).lean();

    await deleteFromCloudinary(files);

    await FileModel.deleteMany({ folderId: { $in: folderIds } });

    await Folder.deleteMany({ _id: { $in: folderIds } });
}
