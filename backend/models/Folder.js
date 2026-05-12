const folderSchema = new mongoose.Schema({
  name: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});