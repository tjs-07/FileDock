"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./files.css";
import AddFilesModal from "../../../component/AddFilesModal";

export default function Files() {

    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const getFiles = async () => {

        try {

            const response = await axios.get(
                "/api/file"
            );

            setFiles(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFile = async (id) => {

        try {

            const response = await axios.delete(`/api/file/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "File was not deleted");
            }

            setFiles((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getFiles();
    }, []);

    return (

        <div className="container-fluid px-0">

            {/* Header */}
            <div className="card p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div >

                        <h4 className="mb-1">
                            All Files
                        </h4>

                        <p className="text-muted mb-0">
                            Manage uploaded files here
                        </p>



                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >

                        + Add Files

                    </button>

                </div>

            </div>
            {/* Modal */}
            {showModal && (

                <AddFilesModal
                    onClose={() => setShowModal(false)}
                    refreshFiles={getFiles}
                />

            )}

            {/* File Cards */}
            <div className="row">

                {files.map((item, index) => {

                    const colors = [
                        "primary",
                        "success",
                        "danger",
                        "warning",
                        "info",
                        "secondary",
                    ];

                    const color = colors[index % colors.length];

                    return (

                        <div
                            className="col-sm-6 col-lg-3 mb-4"
                            key={item._id}
                        >

                            <div className={`card card-border-shadow-${color} h-100 file-card`}>

                                <div className="card-body">

                                    {/* Top */}
                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        {/* File Info */}
                                        <div className="d-flex align-items-center">

                                            <div className="avatar me-3">

                                                <span className={`avatar-initial rounded-3 bg-label-${color}`}>

                                                    <i className="ri-file-pdf-line ri-24px"></i>

                                                </span>

                                            </div>

                                            <div>

                                                <h6 className="mb-1 fw-semibold text-break" style={{
                                                    wordBreak: "break-word",
                                                    whiteSpace: "normal",
                                                    lineHeight: "1.4"
                                                }}>

                                                    {item.title}

                                                </h6>

                                                {/* <p className="mb-0 text-muted small">

                                                {item.folderId?.name}

                                            </p> */}

                                            </div>

                                        </div>

                                        {/* Hover Actions */}
                                        <div className="file-actions">

                                            {/* View */}
                                            <a
                                                href={`/api/file/${item._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-icon btn-text-primary"
                                            >

                                                <i className="ri-eye-line"></i>

                                            </a>

                                            {/* Delete */}
                                            <button
                                                className="btn btn-sm btn-icon btn-text-danger"
                                                onClick={() => {

                                                    if (window.confirm("Delete this file?")) {

                                                        deleteFile(item._id);

                                                    }

                                                }}
                                            >

                                                <i className="ri-delete-bin-line"></i>

                                            </button>

                                        </div>

                                    </div>

                                    {/* Category and Folder */}
                                    <div className="mt-3 d-flex align-items-start gap-4">

                                        {/* Category */}
                                        <div>

                                            <small className="text-muted d-block mb-1">

                                                Category

                                            </small>

                                            <span className={`badge bg-label-primary`}>

                                                {item.folderId?.categoryId?.name}

                                            </span>

                                        </div>

                                        {/* Folder */}
                                        <div>

                                            <small className="text-muted d-block mb-1">

                                                Folder

                                            </small>

                                            <span className={`badge bg-label-info`}>

                                                {item.folderId?.name}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}
