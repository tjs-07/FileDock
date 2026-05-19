import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import File from "@/models/Files";

import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {

    try {

        await connectDB();

        const { id } = params;

        const file = await File.findById(id);

        if (!file) {

            return errorResponse("File not found");

        }

        // Physical file path
        const fullPath = path.join(
            process.cwd(),
            file.filePath
        );

        // Delete physical file
        if (fs.existsSync(fullPath)) {

            fs.unlinkSync(fullPath);

        }

        // Delete DB record
        await File.findByIdAndDelete(id);

        return json({
            success: true,
            message: "File Deleted"
        });

    } catch (error) {

        return errorResponse(error);

    }

}