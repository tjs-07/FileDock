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

        const [pdfs, setPdfs] = useState([]);

        const [error, setError] = useState("");

        const [isSubmitting, setIsSubmitting] = useState(false);

        const getCategories = async () => {

            try {

                const response = await axios.get("/api/category");

            setCategories(response.data.data);

            } catch (error) {

                console.log(error);

            }

        };

        useEffect(() => {
            getCategories();
        }, []);

        const handleSubmit = async (e) => {

            e.preventDefault();
            setError("");

            if (!name.trim()) {
                setError("Folder name is required");
                return;
            }

            setIsSubmitting(true);

            try {

                const formData = new FormData();

                formData.append("name", name.trim());

                if (categoryId) {
                    formData.append("categoryId", categoryId);
                }

                for (let i = 0; i < pdfs.length; i++) {

                    formData.append("pdfs", pdfs[i]);

                }

                await axios.post("/api/folder", formData);

                refreshFolders();

                onClose();

            } catch (error) {

                console.log(error);
                setError(
                    error.response?.data?.message ||
                    "Unable to add folder. Please try again."
                );

            } finally {

                setIsSubmitting(false);

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
                        {error && (
                            <div className="alert alert-danger py-2">
                                {error}
                            </div>
                        )}

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
                        {/* <div className="mb-3">

                            <label className="form-label">
                                Upload PDF
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf"
                                multiple
                                onChange={(e) => setPdfs(e.target.files)}
                            />
                            {pdfs.length > 0 && (

                                <div className="mt-2">

                                    {Array.from(pdfs).map((file, index) => (

                                        <div
                                            key={index}
                                            className="border rounded p-2 mb-2"
                                        >
                                            <i className="ri-file-pdf-line text-danger me-2"></i>

                                            {file.name}
                                        </div>

                                    ))}

                                </div>

                            )}

                        </div> */}

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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        );

    }
