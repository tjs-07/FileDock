import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        title: {
            type: String,
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

const folderSchema = new mongoose.Schema({
    name: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    files: {
        type: [fileSchema],
        default: []
    }
});

export default mongoose.models.Folder || mongoose.model("Folder", folderSchema);
