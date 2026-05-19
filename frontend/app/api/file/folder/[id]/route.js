import connectDB from "@/lib/db";

import File from "@/models/Files";

import Folder from "@/models/Folder";

import { json, errorResponse } from "@/lib/api-response";

export async function GET(request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        const files = await File.find({
            folderId: id
        });

        const folder = await Folder.findById(id);

        return json({
            success: true,
            data: files,
            folder
        });

    } catch (error) {

        return errorResponse(error);

    }

}
