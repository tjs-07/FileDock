import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { saveUploadedFile } from "@/lib/uploads";
import { serializeFolderFiles } from "@/lib/folder-files";
import Category from "@/models/Category";
import Folder from "@/models/Folder";
import mongoose from "mongoose";

export const runtime = "nodejs";

void Category;

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();
        const name = formData.get("name")?.toString().trim();
        const categoryId = formData.get("categoryId")?.toString();

        if (!name) {
            return json({
                success: false,
                message: "Folder name is required"
            }, 400);
        }

        if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
            return json({
                success: false,
                message: "Please select a valid category"
            }, 400);
        }

        const folder = new Folder({
            name,
            ...(categoryId ? { categoryId } : {})
        });

        await folder.save();

        const pdfs = formData
            .getAll("pdfs")
            .filter((file) => file && file.size > 0);

        if (pdfs.length > 0) {
            const savedFiles = await Promise.all(
                pdfs.map((file) => saveUploadedFile(file))
            );

            folder.files = savedFiles.map((file) => ({
                title: file.originalname,
                fileUrl: file.fileUrl,
                fileType: file.fileType,
                size: file.size
            }));

            await folder.save();
        }

        return json({
            success: true,
            message: "Folder Added"
        });
    } catch (error) {
        return errorResponse(error);
    }
}

export async function GET(request) {
    try {
        await connectDB();

        const folders = await Folder.find().populate("categoryId");
        const finalData = await Promise.all(
            folders.map(async (folder) => {
                return {
                    ...folder._doc,
                    files: serializeFolderFiles(folder, request)
                };
            })
        );

        return json(finalData);
    } catch (error) {
        return errorResponse(error);
    }
}
