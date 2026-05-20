import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { streamFileInline } from "@/lib/cloudinary-file-view";
import Folder from "@/models/Folder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, context) {
    try {
        await connectDB();

        const { folderName, fileName } = await context.params;
        const publicId = `${folderName}/${fileName}`;

        const folder = await Folder.findOne({
            "files.publicId": publicId
        });
        const file = folder?.files?.find((item) => item.publicId === publicId);

        if (!file) {
            return json({
                success: false,
                message: "File not found"
            }, 404);
        }

        const response = await streamFileInline(file);

        if (response.error) {
            return json({
                success: false,
                message: "Unable to load file"
            }, response.status);
        }

        return response;
    } catch (error) {
        return errorResponse(error);
    }
}
