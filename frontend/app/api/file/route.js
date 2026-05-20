import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";

import File from "@/models/Files";
import Folder from "@/models/Folder";

import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

function sanitizePathPart(value) {
    return value
        .trim()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "file";
}

function sanitizeFilename(value) {
    const parts = value.trim().split(".");
    const extension = parts.length > 1 ? parts.pop() : "";
    const name = sanitizePathPart(parts.join(".") || value);

    return extension
        ? `${name}.${extension.toLowerCase().replace(/[^a-z0-9]/g, "")}`
        : name;
}


// GET FILES
export async function GET() {

    try {

        await connectDB();

        const files = await File.find().populate({
            path: "folderId",
            populate: {
                path: "categoryId"
            }
        });

        return json(files);

    } catch (error) {

        return errorResponse(error);

    }

}


// UPLOAD FILES
export async function POST(request) {

    try {

        await connectDB();

        const formData = await request.formData();

        const folderId = formData.get("folderId");

        const uploadedFiles = formData.getAll("files");

        const folder = await Folder.findById(folderId);

        if (!folder) {

            return json({
                success: false,
                message: "Folder not found"
            }, 404);

        }

        const savedFiles = [];

        for (const file of uploadedFiles) {

            if (!file || file.size === 0) {
                continue;
            }

            const bytes = await file.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const base64 = buffer.toString("base64");

            const dataURI =
                `data:${file.type};base64,${base64}`;

            const publicId =
                `${sanitizePathPart(folder.name)}/${sanitizeFilename(file.name)}`;

            const uploaded = await cloudinary.uploader.upload(
                dataURI,
                {
                    public_id: publicId,
                    resource_type: "raw",
                    overwrite: true
                }
            );

            // Save DB
            const newFile = await File.create({

                title: file.name,

                folderId,

                fileUrl: uploaded.secure_url,

                publicId: uploaded.public_id,

                resourceType: uploaded.resource_type || "raw",

                fileType: file.type,

                size: file.size

            });

            savedFiles.push(newFile);

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
