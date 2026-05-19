"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import AddFileModal from "../../../../component/AddFilesModal";

export default function FolderFilesPage({ params }) {

    const { id } = params;

    const [files, setFiles] = useState([]);

    const [folder, setFolder] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const getFiles = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/files/folder/${id}`
            );

            setFiles(response.data.data);

            setFolder(response.data.folder);

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

                    <div>

                        <h4 className="mb-1">
                            {folder?.name}
                        </h4>

                        <p className="text-muted mb-0">
                            Folder Files
                        </p>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add File
                    </button>

                </div>

            </div>

            {/* Upload Modal */}
            {showModal && (

                <AddFileModal
                    folderId={id}
                    onClose={() => setShowModal(false)}
                    refreshFiles={getFiles}
                />

            )}

            {/* Files */}
            <div className="row">

                {files.map((file) => (

                    <div
                        className="col-md-3 mb-4"
                        key={file._id}
                    >

                        <div className="card h-100">

                            <div className="card-body">

                                <div className="d-flex align-items-center mb-3">

                                    <i className="ri-file-pdf-line text-danger ri-24px me-2"></i>

                                    <div>

                                        <h6 className="mb-0">
                                            {file.title}
                                        </h6>

                                    </div>

                                </div>

                                <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    className="btn btn-primary btn-sm"
                                >
                                    View File
                                </a>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}