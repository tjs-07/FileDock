require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Folder = require("./models/Folder");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

// ADD CATEGORY
app.post("/category", async (req, res) => {

    try {

        const category = new Category({
            name: req.body.name
        });

        await category.save();

        res.json({
            success: true,
            message: "Category Added",
            data: category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// GET CATEGORY
app.get("/category", async (req, res) => {

    try {

        const categories = await Category.find();

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


app.delete("/category/:id", async (req, res) => {

    try {

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Category Deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ADD FOLDER
app.post("/folder", async (req, res) => {

    try {

        const folder = new Folder({

            name: req.body.name,
            categoryId: req.body.categoryId

        });

        await folder.save();

        res.json({
            success: true,
            message: "Folder Added",
            data: folder
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// GET FOLDERS
app.get("/folder", async (req, res) => {

    try {

        const folders = await Folder.find()
            .populate("categoryId");

        res.json(folders);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// DELETE FOLDER
app.delete("/folder/:id", async (req, res) => {

    try {

        await Folder.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Folder Deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

app.use(cors());

app.use(cors({
    origin: "https://investor-portal-lyart.vercel.app/"
}));

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
});