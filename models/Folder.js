import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        // null = top-level folder
        parentFolderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.Folder ||
    mongoose.model("Folder", folderSchema);
