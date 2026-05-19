"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import axios from "axios";

import AddFileModal from "../../../../component/AddFilesModal";

import FileCard from "../../../../component/FileCard";

export default function FolderFilesPage() {

    const { id } = useParams();

    const [files, setFiles] = useState([]);

    const [folder, setFolder] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const getFiles = async () => {

        try {
            if (!id) {
                return;
            }

            const response = await axios.get(
                `/api/file/folder/${id}`
            );

            setFiles(response.data.data);

            setFolder(response.data.folder);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFile = async (fileId) => {

        try {

            const response = await axios.delete(`/api/file/${fileId}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "File was not deleted");
            }

            setFiles((prev) =>
                prev.filter((item) => item._id !== fileId)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (id) {
            getFiles();
        }

    }, [id]);

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
