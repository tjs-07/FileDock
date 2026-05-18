"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddCategoryModal from "../../../component/AddCategoryModal";

import "./category.css";

export default function Category() {

    const [showModel, setShowModel] = useState(false);

    const [categories, setCategories] = useState([]);

    const getCategories = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/category`
            );

            setCategories(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteCategory = async (id) => {

        try {

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`
            );

            setCategories((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getCategories();
    }, []);

    // Colors
    const colors = [
        "primary",
        "success",
        "danger",
        "warning",
        "info",
        "secondary",
    ];

    return (

        <div className="container-fluid px-0 category-page">

            {/* Header */}
            <div className=" card category-header d-flex justify-content-between mb-2">

                <div>

                    <h2 className="category-title">
                        All Categories
                    </h2>

                    <p className="category-subtitle">
                        Manage your categories here
                    </p>

                </div>

                <button
                    className="btn btn-primary add-category-btn"
                    onClick={() => setShowModel(true)}
                >
                    + Add Category
                </button>

            </div>

            {/* Modal */}
            {showModel && (

                <AddCategoryModal
                    onClose={() => setShowModel(false)}
                    refreshCategories={getCategories}
                />

            )}

            {/* Cards */}
            <div className="content-wrapper px-0">

                <div className="container-xxl flex-grow-1 container-p-y">

                    <div className="row gy-5">

                        {Array.isArray(categories) &&
                            categories.map((item, index) => {

                                const color = colors[index % colors.length];

                                return (

                                    <div
                                        className="col-lg-3 col-sm-6"
                                        key={item._id}
                                    >

                                        <div className="card category-card">

                                            <div className="card-body">

                                                <div className="d-flex align-items-center justify-content-between">

                                                    {/* Left Side */}
                                                    <div className="d-flex align-items-center flex-wrap">

                                                        <div className="avatar me-3">

                                                            <div className={`avatar-initial bg-label-${color} rounded-3`}>

                                                                <span className="category-icon">
                                                                    <i class="ri-gallery-view-2"></i>
                                                                </span>

                                                            </div>

                                                        </div>

                                                        <div className="card-info">

                                                            <div className="d-flex align-items-center">

                                                                <h5 className="mb-0 category-name">
                                                                    {item.name}
                                                                </h5>

                                                            </div>

                                                            <small className="text-muted">
                                                                Category #{index + 1}
                                                            </small>

                                                        </div>

                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="category-actions">

                                                        {/* Edit */}
                                                        <button
                                                            className="btn btn-sm btn-icon btn-text-secondary edit-btn"
                                                        >
                                                            <i className="ri-edit-line"></i>
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            className="btn btn-sm btn-icon btn-text-danger delete-btn"
                                                            onClick={() => {

                                                                if (window.confirm("Delete this category?")) {
                                                                    deleteCategory(item._id)
                                                                }

                                                            }}
                                                        >
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                    </div>

                </div>

            </div>

        </div>

    );

}