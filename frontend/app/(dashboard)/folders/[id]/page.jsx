"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import AddFileModal from "../../../../component/AddFilesModal";

import FileCard from "../../../../component/FileCard";
import "../../../../component/FileCard.css";
import AddFolderModal from "../../../../component/AddFolderModal";
import FolderCard from "../../../../component/FolderCard";



function FolderFilesContent() {

    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const categoryName = searchParams.get("categoryName");
    const folderName = searchParams.get("folderName");

    const [files, setFiles] = useState([]);

    const [subFolders, setSubFolders] = useState([]);

    const [folder, setFolder] = useState(null);

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [showFolderModal, setShowFolderModal] = useState(false);

    const getFiles = async () => {

        try {
            if (!id) {
                return;
            }

            const response = await axios.get(
                `/api/file/folder/${id}`
            );

            setFiles(response.data.data?.files || []);

            setSubFolders(response.data.data?.subFolders || []);

            setFolder(response.data.data?.folder || null);

            setBreadcrumbs(response.data.data?.breadcrumbs || []);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFolder = async (folderId) => {

        try {

            const response = await axios.delete(`/api/folder/${folderId}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "Folder was not deleted");
            }

            setSubFolders((prev) =>
                prev.filter((item) => (item.id ?? item._id) !== folderId)
            );

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
                prev.filter((item) => (item.id ?? item._id) !== fileId)
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
        file.viewUrl || file.file_url || file.fileUrl || (file.publicId
            ? `/${file.publicId.split("/").map(encodeURIComponent).join("/")}`
            : `/api/file/${file.id ?? file._id}`);

    const canViewFile = (file) =>
        Boolean(file.file_url || file.publicId || (file.fileUrl && !file.fileUrl.includes("onrender.com/uploads/")));

    const breadcrumbCategoryId = categoryId || folder?.category_id || folder?.categoryId?.id || folder?.categoryId?._id;
    const breadcrumbCategoryName = categoryName || folder?.category_name || folder?.categoryId?.name;
    const breadcrumbFolderName = folder?.name || folderName;

    const openFolder = (folderItem) => {

        const params = new URLSearchParams();

        if (breadcrumbCategoryId) {
            params.set("categoryId", breadcrumbCategoryId.toString());
        }

        if (breadcrumbCategoryName) {
            params.set("categoryName", breadcrumbCategoryName);
        }

        router.push(`/folders/${folderItem.id}?${params.toString()}`);

    };

    return (

        <div className="container-fluid px-0">

            {(breadcrumbCategoryName || breadcrumbFolderName) && (
                <div className="d-flex align-items-center gap-2 px-4 pt-4 mb-2">

                    {breadcrumbCategoryName && (
                        <>
                            <span
                                className="text-primary cursor-pointer"
                                style={{ cursor: "pointer" }}
                                onClick={() => {

                                    const params = new URLSearchParams();

                                    if (breadcrumbCategoryId) {
                                        params.set("categoryId", breadcrumbCategoryId.toString());
                                    }

                                    params.set("categoryName", breadcrumbCategoryName);

                                    router.push(`/folders?${params.toString()}`);

                                }}
                            >
                                {breadcrumbCategoryName}
                            </span>
                        </>
                    )}

                    {breadcrumbs.map((item, index) => {

                        const isLast =
                            index === breadcrumbs.length - 1;

                        return (

                            <div
                                key={item.id}
                                className="d-flex align-items-center gap-2"
                            >

                                {(breadcrumbCategoryName || index > 0) && (
                                    <i className="ri-arrow-right-s-line text-muted"></i>
                                )}

                                <span
                                    className={isLast ? "fw-semibold" : "text-primary cursor-pointer"}
                                    style={{ cursor: isLast ? "default" : "pointer" }}
                                    onClick={() => {

                                        if (!isLast) {
                                            openFolder(item);
                                        }

                                    }}
                                >
                                    {item.name}
                                </span>

                            </div>

                        );

                    })}

                    {breadcrumbs.length === 0 && breadcrumbFolderName && (
                        <>
                            {breadcrumbCategoryName && (
                                <i className="ri-arrow-right-s-line text-muted"></i>
                            )}

                            <span className="fw-semibold">
                                {breadcrumbFolderName}
                            </span>
                        </>
                    )}

                </div>
            )}

            {/* Header */}
            <div className=" p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h4 className="mb-1">
                            {folder?.name}
                        </h4>

                        <p className="text-muted mb-0">
                            Folder Files
                        </p>

                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn dotted-btn"
                            onClick={() => setShowFolderModal(true)}
                        >
                            + Add Folder
                        </button>
                        <button
                            className="btn file-btn"
                            onClick={() => setShowModal(true)}
                        >
                            + Add File
                        </button>


                    </div>

                </div>

            </div>

            {/* Upload Modal */}
            {showFolderModal && (
                <AddFolderModal
                    onClose={() => setShowFolderModal(false)}
                    refreshFolders={getFiles}
                    initialCategoryId={breadcrumbCategoryId?.toString() || ""}
                    initialCategoryName={breadcrumbCategoryName || ""}
                    initialParentFolderId={id?.toString() || ""}
                />
            )}
            {showModal && (

                <AddFileModal
                    folderId={id}
                    onClose={() => setShowModal(false)}
                    refreshFiles={getFiles}
                />

            )}

            {/* Folders and Files */}
            <div className="folder-grid px-4">

                {subFolders.map((item, index) => {

                    const colors = [
                        "primary",
                        "success",
                        "danger",
                        "warning",
                        "info",
                        "secondary",
                    ];

                    return (

                        <FolderCard
                            key={item.id ?? item._id}
                            item={item}
                            color={colors[index % colors.length]}
                            categoryId={breadcrumbCategoryId}
                            categoryName={breadcrumbCategoryName}
                            onEdit={() => {}}
                            onDelete={(folder) => {
                                if (window.confirm("Delete this folder?")) {
                                    deleteFolder(folder.id ?? folder._id);
                                }
                            }}
                        />

                    );

                })}

                {files.map((item, index) => (

                    <FileCard
                        key={item.id ?? item._id}
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

export default function FolderFilesPage() {

    return (
        <Suspense fallback={null}>
            <FolderFilesContent />
        </Suspense>
    );

}
