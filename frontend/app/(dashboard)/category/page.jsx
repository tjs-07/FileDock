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

    // Icons
    const icons = [
        "ri-gallery-view-2-line",
        "ri-image-line",
        "ri-folder-image-line",
        "ri-camera-lens-line",
        "ri-slideshow-line",
        "ri-landscape-line",
    ];

    return (

        <div className="container-fluid px-0">

            <div className="category-wrapper">

                {/* Header */}
                <div className="category-header">

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
                <div className="row">

                    {Array.isArray(categories) &&
                        categories.map((item, index) => {

                            const color = colors[index % colors.length];
                            const icon = icons[index % icons.length];

                            return (

                                <div
                                    className="col-xl-3 col-lg-4 col-md-6 mb-4"
                                    key={item._id}
                                >

                                    <div className="category-card">

                                        {/* Actions */}
                                        <div className="category-actions">

                                            {/* Edit */}
                                            <button className="btn btn-light border">
                                                <i className="ri-edit-line"></i>
                                            </button>

                                            {/* Delete */}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {

                                                    if (window.confirm("Delete this category?")) {
                                                        deleteCategory(item._id)
                                                    }

                                                }}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>

                                        </div>

                                        {/* Content */}
                                        <div className="d-flex align-items-center">

                                            {/* Icon */}
                                            <div
                                                className={`category-icon bg-${color} bg-opacity-10 text-${color}`}
                                            >
                                                <i className={icon}></i>
                                            </div>

                                            {/* Text */}
                                            <div>

                                                <h5 className="category-name">
                                                    {item.name}
                                                </h5>

                                                <small className="text-muted">
                                                    Category #{index + 1}
                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                </div>

            </div>

        </div>

    );

}