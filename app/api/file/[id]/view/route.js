import mongoose from "mongoose";
import connectDB from "@/lib/db";
import FileModel from "@/models/File";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const safeHeaderName = (name) =>
    String(name || "document")
        .replace(/[\r\n"]/g, "")
        .replace(/[^\x20-\x7E]/g, "_");

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
        upstream = await fetch(file.fileUrl, { redirect: "follow" });
    } catch {
        return new Response("Unable to load file", { status: 502 });
    }

    if (!upstream.ok) {
        return new Response("Unable to load uploaded file", {
            status: upstream.status === 404 ? 404 : 502
        });
    }

    const headers = new Headers();
    headers.set(
        "Content-Type",
        upstream.headers.get("content-type") ||
            file.fileType ||
            "application/octet-stream"
    );
    headers.set(
        "Content-Disposition",
        `inline; filename="${safeHeaderName(file.name)}"`
    );
    headers.set("Cache-Control", "private, max-age=3600");

    return new Response(upstream.body, {
        status: 200,
        headers
    });
}
