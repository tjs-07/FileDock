import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { serializeFile } from "@/lib/serialize";
import Folder from "@/models/Folder";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ALL FILES
export async function GET() {

    try {

        await connectDB();

        const files = await FileModel.find()
            .sort({ createdAt: -1 })
            .lean();

        const folders = await Folder.find({
            _id: { $in: files.map((file) => file.folderId) }
        })
            .select("name")
            .lean();

        const folderNames = Object.fromEntries(
            folders.map((folder) => [folder._id.toString(), folder.name])
        );

        return json({
            success: true,
            data: files.map((file) =>
                serializeFile(file, {
                    folder_name: folderNames[file.folderId.toString()] ?? null
                })
            )
        });

    } catch (error) {
        return errorResponse(error);
    }
}

// UPLOAD FILES
export async function POST(request) {

    try {

        await connectDB();

        const formData = await request.formData();

        const folderId = formData.get("folderId")?.toString();
        const uploadedFiles = formData.getAll("files");

        if (!folderId || !mongoose.isValidObjectId(folderId)) {
            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        const folder = await Folder.exists({ _id: folderId });

        if (!folder) {
            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        const savedFiles = [];

        for (const file of uploadedFiles) {

            if (!file || file.size === 0) continue;

            const buffer = Buffer.from(await file.arrayBuffer());

            const result = await uploadToCloudinary(buffer, folderId, file.name, file.type);

            const saved = await FileModel.create({
                name: file.name,
                folderId,
                fileUrl: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resource_type,
                fileType: file.type,
                size: file.size
            });

            savedFiles.push(serializeFile(saved));
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