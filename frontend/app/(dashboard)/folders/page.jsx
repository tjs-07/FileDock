"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddFolderModal from "../../../component/AddFolderModal";
import "./folder.css";
import { useRouter } from "next/navigation";

export default function Folders() {

    const [showModal, setShowModal] = useState(false);

    const [folders, setFolders] = useState([]);

    const [openFolder, setOpenFolder] = useState(null);


    const router = useRouter();

    const getFolders = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/folder`
            );

            setFolders(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFolder = async (id) => {

        try {

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/folder/${id}`
            );

            setFolders((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getFolders();
    }, []);

    return (

        <div className="container-fluid px-0">

            {/* Header */}
            <div className="card p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h4 className="mb-1">
                            All Folders
                        </h4>

                        <p className="text-muted mb-0">
                            Manage your folders here
                        </p>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Folder
                    </button>

                </div>

            </div>

            {/* Modal */}
            {showModal && (

                <AddFolderModal
                    onClose={() => setShowModal(false)}
                    refreshFolders={getFolders}
                />

            )}

            {/* Folder Cards */}
            <div className="row">

                {folders.map((item, index) => {

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
                            <div
                                className={`card card-border-shadow-${color} h-100 folder-card`}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    router.push(`/dashboard/folders/${item._id}`);
                                }}
                            >

                                <div className="card-body">

                                    {/* Top */}
                                    <div className="d-flex align-items-start justify-content-between mb-3">

                                        {/* Folder Icon + Name */}
                                        <div className="d-flex align-items-center">

                                            <div className="avatar me-3">

                                                <span className={`avatar-initial rounded-3 bg-label-${color}`}>

                                                    <i className="ri-folder-2-line ri-24px"></i>

                                                </span>

                                            </div>

                                            <div>

                                                <h6 className="mb-1 fw-semibold">

                                                    {item.name}

                                                </h6>

                                                <p className="mb-0 text-muted small">

                                                    {item.categoryId?.name}

                                                </p>

                                            </div>

                                        </div>

                                        {/* Hover Actions */}
                                        <div className="folder-actions">

                                            {/* Edit */}
                                            <button
                                                className="btn btn-sm btn-icon btn-text-secondary"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                }}
                                            >

                                                <i className="ri-edit-line"></i>

                                            </button>

                                            {/* Delete */}
                                            <button
                                                className="btn btn-sm btn-icon btn-text-danger"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    if (window.confirm("Delete this folder?")) {

                                                        deleteFolder(item._id);

                                                    }

                                                }}
                                            >

                                                <i className="ri-delete-bin-line"></i>

                                            </button>

                                        </div>

                                    </div>

                                    {/* Files */}
                                    {/* {openFolder === item._id && (

                                        <div className="mt-4">

                                            <hr />

                                            <h6 className="mb-3">
                                                Folder Files
                                            </h6>

                                            {item.files?.length > 0 ? (

                                                item.files.map((file) => (

                                                    <div
                                                        key={file._id}
                                                        className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
                                                    >

                                                        <div className="d-flex align-items-center">

                                                            <i className="ri-file-pdf-line text-danger me-2"></i>

                                                            <span>
                                                                {file.title}
                                                            </span>

                                                        </div>

                                                        <a
                                                            href={file.fileUrl}
                                                            target="_blank"
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            View
                                                        </a>

                                                    </div>

                                                ))

                                            ) : (

                                                <p className="text-muted mb-0">
                                                    No files uploaded
                                                </p>

                                            )}

                                        </div>

                                    )} */}

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}