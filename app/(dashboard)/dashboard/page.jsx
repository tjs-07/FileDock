"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "../../../component/CategoryCard";
import AddCategoryModal from "../../../component/AddCategoryModal";
import EditCategoryModal from "../../../component/EditCategoryModal";
import AddFileModal from "../../../component/AddFilesModal";
import AddFolderModal from "../../../component/AddFolderModal";



export default function Dashboard() {

    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

    const [editCategoryModal, setEditCategoryModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [showAddFileModal, setShowAddFileModal] = useState(false);

    const [showAddFolderModal, setShowAddFolderModal] = useState(false);

    const [stats, setStats] = useState({

        totalCategories: 0,
        totalFolders: 0,
        totalFiles: 0

    });

    const [categoris, setcategories] = useState([]);

    const deleteCategory = async (id) => {

        try {

            const response = await axios.delete(`/api/category/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "Category was not deleted");
            }

            setcategories((prev) =>
                prev.filter((item) => (item.id ?? item._id) !== id)
            );

            getDashboardData();

        } catch (error) {

            console.log(error);

        }

    };


    const getDashboardData = async () => {

        try {

            const statsResponse = await axios.get(
                "/api/dashboard-stats"
            );

            setStats(statsResponse.data);

        } catch (error) {

            console.log(error);

        }

    };

    const getCategories = async () => {
        try {
            const response = await axios.get("api/category");
            setcategories(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getDashboardData();
            getCategories();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, []);

    return (

        <div className="container-fluid px-0">

            {/* HEADING */}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="mb-4">

                    <h3 className="mb-1">
                        Welcome Back
                    </h3>

                    <p className="text-muted mb-0">
                        Investor Portal Dashboard
                    </p>

                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => setShowAddCategoryModal(true)}>
                        Add Category
                    </button>
                    <button className="btn dotted-btn" onClick={() => setShowAddFolderModal(true)}>
                        Add Folder
                    </button>
                    <button className="btn file-btn" onClick={() => setShowAddFileModal(true)}>
                        Add File
                    </button>
                </div>
                {showAddCategoryModal && (

                    <AddCategoryModal
                        onClose={() => setShowAddCategoryModal(false)}
                        refreshCategories={getCategories}
                    />

                )}
                {editCategoryModal && (

                    <EditCategoryModal
                        category={selectedCategory}
                        onClose={() => setEditCategoryModal(false)}
                        refreshCategories={getCategories}
                    />

                )}
                {showAddFileModal && (
                    <AddFileModal
                        onClose={() => setShowAddFileModal(false)}
                        refreshFiles={getDashboardData}
                    />
                )}
                {showAddFolderModal && (
                    <AddFolderModal
                        onClose={() => setShowAddFolderModal(false)}
                        refreshFolders={getDashboardData}
                    />
                )}
            </div>

            {/* STATISTICS */}

            <div className="row">

                {/* CATEGORY */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total Categories
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalCategories}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#e8f2ff"
                                    }}
                                >

                                    <i
                                        className="ri-layout-2-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#0d6efd"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOLDER */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total Folders
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalFolders}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#fff3e6"
                                    }}
                                >

                                    <i
                                        className="ri-folder-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#ff9800"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FILES */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total PDFs
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalFiles}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#ffecec"
                                    }}
                                >

                                    <i
                                        className="ri-file-pdf-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#f44336"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* RECENT FILES */}

            <div className="">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h4 className="mb-0">
                            Recent Uploaded Categories
                        </h4>
                        {/* <div className="d-flex gap-2">
                            <button className="btn btn-primary">Add Category</button>
                        <button className="btn dotted-btn">Add Folder</button>
                        <button className="btn file-btn">Add File</button>
                        </div> */}
                    </div>

                </div>


            </div>

            <div className="row gy-5">

                {categoris?.map((item, index) => (

                    <CategoryCard
                        key={item.id ?? item._id}
                        item={item}
                        index={index}
                        onEdit={(category) => {
                            setSelectedCategory(category);
                            setEditCategoryModal(true);
                        }}
                        onDelete={(id) => {

                            if (window.confirm("Delete this category?")) {
                                deleteCategory(id);
                            }

                        }}
                    />

                ))}

            </div>

        </div>

    );

}
