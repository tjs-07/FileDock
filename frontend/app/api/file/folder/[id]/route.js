import connectDB from "@/lib/db";

import Folder from "@/models/Folder";

import { json, errorResponse } from "@/lib/api-response";
import { serializeFolderFiles } from "@/lib/folder-files";

export async function GET(request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        const folder = await Folder.findById(id).populate("categoryId");

        if (!folder) {
            return json({
                success: false,
                message: "Folder not found"
            }, 404);
        }

        return json({
            success: true,
            data: serializeFolderFiles(folder, request),
            folder
        });

    } catch (error) {

        return errorResponse(error);

    }

}
