"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AddFolderModal({

    onClose,
    refreshFolders

}) {

    const [name, setName] = useState("");

    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState([]);

    const getCategories = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/category`
            );

            setCategories(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/folder`,
                {
                    name,
                    categoryId
                }
            );

            refreshFolders();

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

                <h5>Add Folder</h5>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Folder Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter folder name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Select Category
                        </label>

                        <select
                            className="form-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map((item) => (

                                <option
                                    key={item._id}
                                    value={item._id}
                                >
                                    {item.name}
                                </option>

                            ))}

                        </select>

                    </div>
                    <div className="mb-3">

                        <label className="form-label">
                            Upload PDF
                        </label>

                        <input
                            type="file"
                            className="form-control"
                            accept=".pdf"
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