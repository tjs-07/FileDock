import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            required: true
        },

        fileUrl: String,

        publicId: String,

        resourceType: {
            type: String,
            default: "raw"
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
