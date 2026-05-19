"use client";

import { useState } from "react";

import axios from "axios";

export default function EditCategoryModal({
    category,
    onClose,
    refreshCategories
}) {

    const [name, setName] = useState(category?.name || "");

    const [loading, setLoading] = useState(false);

    const updateCategory = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.put(
                `/api/category/${category._id}`,
                { name: name.trim() }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Category was not updated");
            }

            refreshCategories();

            onClose();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal fade show d-block">

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">

                        <h5 className="modal-title">
                            Edit Category
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    {/* Body */}
                    <form onSubmit={updateCategory}>

                        <div className="modal-body">

                            <label className="form-label">
                                Category Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Footer */}
                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {
                                    loading
                                        ? "Updating..."
                                        : "Update"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}
