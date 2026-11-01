"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";

import AddFolderModal from "../../../component/AddFolderModal";
import EditFolderModal from "../../../component/EditFolderModal";
import FolderCard from "../../../component/FolderCard";

import "./folder.css";
import { useRouter, useSearchParams } from "next/navigation";

function FoldersContent() {

    const [showModal, setShowModal] = useState(false);

    const [folders, setFolders] = useState([]);

    const [openFolder, setOpenFolder] = useState(null);

    const [editModal, setEditModal] = useState(false);

    const [selectedFolder, setSelectedFolder] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const categoryName = searchParams.get("categoryName");

    const getFolders = async () => {

        try {

            const response = await axios.get(
                categoryId
                    ? `/api/folder/category/${categoryId}`
                    : "/api/folder"
            );

            setFolders(response.data.data || []);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFolder = async (id) => {

        try {

            const response = await axios.delete(`/api/folder/${id}`);

            if (!response.data.success) {
                throw new Error(response.data.message || "Folder was not deleted");
            }

            setFolders((prev) =>
                prev.filter((item) => (item.id ?? item._id) !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getFolders();
    }, [categoryId]);

    return (

        <div className="container-fluid px-0">

            {categoryName && (
                <div className="d-flex align-items-center gap-1 px-4 pt-4 mb-2">



                    <span className="fw-semibold" style={{ cursor: "pointer" }}
                        onClick={() => router.push("/category")}>
                        {categoryName}
                    </span>
                    <i className="ri-arrow-right-s-line text-muted"></i>

                </div>
            )}

            {/* Header */}
            <div className=" p-4 mb-4">

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
                        className="btn dotted-btn"
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
                    initialCategoryId={categoryId || ""}
                    initialCategoryName={categoryName || ""}
                />

            )}

            {editModal && (

                <EditFolderModal
                    folder={selectedFolder}
                    onClose={() => setEditModal(false)}
                    refreshFolders={getFolders}
                />

            )}


            {/* Folder Wrapper */}
            <div className="folder-grid px-4">

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

                        <FolderCard
                            key={item.id ?? item._id}
                            item={item}
                            color={color}
                            categoryId={categoryId}
                            categoryName={categoryName}
                            onEdit={(folder) => {
                                setSelectedFolder(folder);
                                setEditModal(true);
                            }}
                            onDelete={(folder) => {
                                if (window.confirm("Delete this folder?")) {
                                    deleteFolder(folder.id ?? folder._id);
                                }
                            }}
                        />

                    );

                })}

            </div>

        </div>

    );

}

export default function Folders() {

    return (
        <Suspense fallback={null}>
            <FoldersContent />
        </Suspense>
    );

}
