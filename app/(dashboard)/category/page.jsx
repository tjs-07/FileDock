"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddCategoryModal from "../../../component/AddCategoryModal";
import EditCategoryModal from "../../../component/EditCategoryModal";
import CategoryCard from "../../../component/CategoryCard";
import "./category.css";

export default function Category() {

    const [showModel, setShowModel] = useState(false);

    const [categories, setCategories] = useState([]);

    const [editModal, setEditModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const getCategories = async () => {

        try {

            const response = await axios.get(
                "/api/category",
                {
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                }
            );

            setCategories(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteCategory = async (id) => {

        try {

            const response = await axios.delete(`/api/category/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "Category was not deleted");
            }

            setCategories((prev) =>
                prev.filter((item) => (item.id ?? item._id) !== id)
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

    ];

    return (

        <div className="container-fluid px-0 category-page">

            {/* Header */}
            <div className=" d-flex flex-row align-items-center justify-content-between p-4 mb-4">

                <div>

                    <h4 className="mb-1">
                        All Categories
                    </h4>

                    <p className="text-muted mb-0">
                        Manage your categories here
                    </p>

                </div>

                <button
                    className="btn btn-primary"
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

            {editModal && (

                <EditCategoryModal
                    category={selectedCategory}
                    onClose={() => setEditModal(false)}
                    refreshCategories={getCategories}
                />

            )}

            {/* Cards */}
            <div className="content-wrapper px-0">



                <div className="row gy-5">

                    {Array.isArray(categories) &&
                        categories?.map((item, index) => {

                            const color = colors[index % colors.length];

                            return (

                                <CategoryCard
                                    key={item.id ?? item._id}
                                    item={item}
                                    index={index}
                                    color={color}
                                    onEdit={(item) => {

                                        setSelectedCategory(item);
                                        setEditModal(true);

                                    }}
                                    onDelete={(id) => {

                                        if (window.confirm("Delete this category?")) {
                                            deleteCategory(id);
                                        }

                                    }}
                                />

                            );

                        })}

                </div>



            </div>

        </div>

    );

}
