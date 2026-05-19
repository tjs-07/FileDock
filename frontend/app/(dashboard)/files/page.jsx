"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./files.css";
import AddFilesModal from "../../../component/AddFilesModal";
import FileCard from "../../../component/FileCard";

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

    const getFilePath = (file) =>
        file.publicId
            ? `/${file.publicId.split("/").map(encodeURIComponent).join("/")}`
            : `/api/file/${file._id}`;

    const canViewFile = (file) =>
        Boolean(file.publicId || (file.fileUrl && !file.fileUrl.includes("onrender.com/uploads/")));

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

                {files.map((item, index) => (

                    <FileCard
                        key={item._id}
                        item={item}
                        index={index}
                        getFilePath={getFilePath}
                        canViewFile={canViewFile}
                        deleteFile={deleteFile}
                    />

                ))}

            </div>

        </div>

    );

}
