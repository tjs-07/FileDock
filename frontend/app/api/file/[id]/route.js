import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";

import File from "@/models/Files";

import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {

    try {

        await connectDB();

        const { id } = params;

        const file = await File.findById(id);

        if (!file) {

            return errorResponse("File not found");

        }

        // Delete Cloudinary File
        await cloudinary.uploader.destroy(
            file.publicId,
            {
                resource_type: "raw"
            }
        );

        // Delete DB Entry
        await File.findByIdAndDelete(id);

        return json({
            success: true,
            message: "File Deleted"
        });

    } catch (error) {

        return errorResponse(error);

    }

}