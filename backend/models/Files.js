const fileSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder"
  }
});