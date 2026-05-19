"use client";

import { useState } from "react";
import axios from "axios";

export default function AddCategoryModal({ onClose, refreshCategories }) {

    const [name, setName] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "/api/category", {
                name
            });

            refreshCategories();

            onClose();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 9999
            }}
        >

            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "100%",
                    maxWidth: "500px"
                }}
            >

                <h5>Add Category</h5>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Category Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter category"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    <div className="d-flex justify-content-end gap-2">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
