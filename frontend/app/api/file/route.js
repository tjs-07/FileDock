import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";

import File from "@/models/Files";
import Folder from "@/models/Folder";

import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";


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

            return errorResponse("Folder not found");

        }

        const savedFiles = [];

        for (const file of uploadedFiles) {

            const bytes = await file.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const base64 = buffer.toString("base64");

            const dataURI =
                `data:${file.type};base64,${base64}`;

            // Upload to Cloudinary
            const uploaded = await cloudinary.uploader.upload(
                dataURI,
                {
                    folder: folder.name,
                    resource_type: "raw"
                }
            );

            // Save DB
            const newFile = await File.create({

                title: file.name,

                folderId,

                fileUrl: uploaded.secure_url,

                publicId: uploaded.public_id,

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