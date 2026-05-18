import path from "path";

export async function saveUploadedFile(file) {
    const extension = path.extname(file.name);
    const filename = `${Date.now()}${extension}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || "application/pdf";

    return {
        filename,
        originalname: file.name,
        fileUrl: `data:${contentType};base64,${buffer.toString("base64")}`
    };
}
