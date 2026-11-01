import mongoose from "mongoose";
import connectDB from "@/lib/db";
import FileModel from "@/models/File";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safeHeaderName = (name) =>
    String(name || "document")
        .replace(/[\r\n"]/g, "")
        .replace(/[^\x20-\x7E]/g, "_");

// Try the public URL first; if Cloudinary refuses it (401/403/404),
// fall back to an authenticated download URL signed with the API secret.
async function fetchFromCloudinary(file) {

    let upstream = await fetch(file.fileUrl, { redirect: "follow" });

    if (upstream.ok) return upstream;

    console.log(
        "[file view] public URL failed:",
        upstream.status,
        upstream.headers.get("x-cld-error") || "",
        file.fileUrl
    );

    if (!file.publicId) return upstream;

    try {
        const signedUrl = cloudinary.utils.private_download_url(
            file.publicId,
            undefined,
            {
                resource_type: file.resourceType || "raw",
                type: "upload",
                attachment: false
            }
        );

        const retry = await fetch(signedUrl, { redirect: "follow" });

        if (!retry.ok) {
            console.log("[file view] signed URL failed:", retry.status);
        }

        return retry;

    } catch (error) {
        console.log("[file view] signing failed:", error.message);
        return upstream;
    }
}

export async function GET(_request, context) {
    await connectDB();

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
        return new Response("File not found", { status: 404 });
    }

    const file = await FileModel.findById(id).lean();
    if (!file?.fileUrl) {
        return new Response("File URL not found", { status: 404 });
    }

    let upstream;
    try {
        upstream = await fetchFromCloudinary(file);
    } catch (error) {
        console.log("[file view] fetch error:", error.message);
        return new Response("Unable to load file", { status: 502 });
    }

    if (!upstream.ok) {
        return new Response(
            `Unable to load uploaded file (Cloudinary status ${upstream.status})`,
            { status: upstream.status === 404 ? 404 : 502 }
        );
    }

    const headers = new Headers();
    headers.set(
        "Content-Type",
        file.fileType ||
            upstream.headers.get("content-type") ||
            "application/octet-stream"
    );
    headers.set(
        "Content-Disposition",
        `inline; filename="${safeHeaderName(file.name)}"`
    );
    headers.set("Cache-Control", "private, max-age=3600");

    return new Response(upstream.body, { status: 200, headers });
}