"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AddFilesModal({

    onClose,
    refreshFiles,
    folderId: initialFolderId

}) {

    const [folders, setFolders] = useState([]);

    const [folderId, setFolderId] = useState(initialFolderId || "");

    const [files, setFiles] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState("");

    const getFolders = async () => {

        try {

            const response = await axios.get("/api/folder");

            setFolders(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getFolders();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!folderId) {

            setError("Please select folder");

            return;

        }

        if (files.length === 0) {

            setError("Please select files");

            return;

        }

        try {

            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("folderId", folderId);

            Array.from(files).forEach((file) => {

                formData.append("files", file);

            });

            await axios.post(
                "/api/file",
                formData
            );

            refreshFiles();

            onClose();

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Upload failed"
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
                background: "rgba(0,0,0,0.5)",
                zIndex: 9999
            }}
        >

            <div
                className="card p-4"
                style={{
                    width: "100%",
                    maxWidth: "550px"
                }}
            >

                <h5 className="mb-4">
                    Add Files
                </h5>

                <form onSubmit={handleSubmit}>

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}

                    {/* Folder */}
                    {!initialFolderId && (
                    <div className="mb-3">

                        <label className="form-label">
                            Select Folder
                        </label>

                        <select
                            className="form-select"
                            value={folderId}
                            onChange={(e) =>
                                setFolderId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Folder
                            </option>

                            {folders.map((folder) => (

                                <option
                                    key={folder._id}
                                    value={folder._id}
                                >

                                    {folder.name}

                                </option>

                            ))}

                        </select>

                    </div>
                    )}

                    {/* File Upload */}
                    <div className="mb-3">

                        <label className="form-label">
                            Upload Files
                        </label>

                        <input
                            type="file"
                            className="form-control"
                            multiple
                            onChange={(e) =>
                                setFiles(e.target.files)
                            }
                        />

                    </div>

                    {/* Preview */}
                    {files.length > 0 && (

                        <div className="mb-3">

                            {Array.from(files).map((file, index) => (

                                <div
                                    key={index}
                                    className="border rounded p-2 mb-2 d-flex align-items-center"
                                >

                                    <i className="ri-file-line me-2"></i>

                                    {file.name}

                                </div>

                            ))}

                        </div>

                    )}

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

                            {isSubmitting
                                ? "Uploading..."
                                : "Upload Files"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}
