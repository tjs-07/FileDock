import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
    getCategoryNames,
    serializeFile,
    serializeFolder
} from "@/lib/serialize";
import Category from "@/models/Category";
import Folder from "@/models/Folder";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET TOP-LEVEL FOLDERS
export async function GET() {

    try {

        await connectDB();

        const folders = await Folder.find({ parentFolderId: null })
            .sort({ createdAt: -1 })
            .lean();

        const categoryNames = await getCategoryNames(folders);

        const files = await FileModel.find({
            folderId: { $in: folders.map((folder) => folder._id) }
        }).lean();

        const data = folders.map((folder) => ({
            ...serializeFolder(
                folder,
                categoryNames[folder.categoryId?.toString()] ?? null
            ),
            files: files
                .filter((file) => file.folderId.toString() === folder._id.toString())
                .map((file) => serializeFile(file))
        }));

        return json({ success: true, data });

    } catch (error) {
        return errorResponse(error);
    }
}

// CREATE FOLDER
export async function POST(request) {

    try {

        await connectDB();

        const formData = await request.formData();

        const name = formData.get("name")?.toString().trim();
        const categoryId = formData.get("categoryId")?.toString().trim();
        const parentFolderId =
            formData.get("parentFolderId")?.toString().trim() || null;

        if (!name) {
            return json({
                success: false,
                message: "Folder name is required"
            }, 400);
        }

        if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
            return json({
                success: false,
                message: "Category is required"
            }, 400);
        }

        if (parentFolderId && !mongoose.isValidObjectId(parentFolderId)) {
            return json({
                success: false,
                message: "Invalid parent folder"
            }, 400);
        }

        const category = await Category.exists({ _id: categoryId });

        if (!category) {
            return json({
                success: false,
                message: "Category not found"
            }, 404);
        }

        const folder = await Folder.create({
            name,
            categoryId,
            parentFolderId
        });

        // Optional PDFs sent with the folder
        const pdfs = formData
            .getAll("pdfs")
            .filter((file) => file && file.size > 0);

        for (const file of pdfs) {

            const buffer = Buffer.from(await file.arrayBuffer());

            const result = await uploadToCloudinary(
                buffer,
                folder._id.toString(),
                file.name,
                file.type
            );

            await FileModel.create({
                name: file.name,
                folderId: folder._id,
                fileUrl: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resource_type,
                fileType: file.type,
                size: file.size
            });
        }

        return json({
            success: true,
            message: "Folder Added",
            data: serializeFolder(folder)
        });

    } catch (error) {
        console.log(error);
        return errorResponse(error);
    }
}