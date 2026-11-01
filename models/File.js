import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
            index: true
        },

        // Cloudinary
        fileUrl: String,

        publicId: String,

        resourceType: {
            type: String,
            default: "image"
        },

        fileType: String,

        size: Number
    },
    {
        timestamps: true
    }
);

export default mongoose.models.File ||
    mongoose.model("File", fileSchema);
