"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddFolderModal from "../../../component/AddFolderModal";

export default function Folders() {

    const [showModal, setShowModal] = useState(false);

    const [folders, setFolders] = useState([]);

    const [openFolder, setOpenFolder] = useState(null);

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

            <div className="card p-5">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h4>All Folders</h4>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Folder
                    </button>

                </div>

                {showModal && (

                    <AddFolderModal
                        onClose={() => setShowModal(false)}
                        refreshFolders={getFolders}
                    />

                )}

                <div className="table-responsive">

                    <table className="table table-striped">

                        <thead className="table-light">

                            <tr>

                                <th>Sr.</th>
                                <th>Folder Name</th>
                                <th>Category</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {folders.map((item, index) => (

                                <>

                                    <tr key={item._id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (openFolder === item._id) {
                                                setOpenFolder(null);
                                            } else {
                                                setOpenFolder(item._id);
                                            }
                                        }}
                                    >

                                        <td>{index + 1}</td>

                                        <td>

                                            <div className="d-flex align-items-center gap-2">

                                                <i
                                                    className={
                                                        openFolder === item._id
                                                            ? "ri-arrow-down-s-line"
                                                            : "ri-arrow-right-s-line"
                                                    }
                                                ></i>

                                                {item.name}

                                            </div>

                                        </td>

                                        <td>{item.categoryId?.name}</td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {

                                                    if (window.confirm("Delete this folder?")) {

                                                        deleteFolder(item._id)

                                                    }

                                                }}
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>

                                        </td>

                                    </tr>

                                    {openFolder === item._id && (

                                        <tr>

                                            <td colSpan="4">

                                                <div className="p-3 bg-light rounded">

                                                    <h6 className="mb-3">
                                                        Uploaded PDFs
                                                    </h6>

                                                    {item.files?.length > 0 ? (

                                                        item.files.map((file) => (

                                                            <div
                                                                key={file._id}
                                                                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                                                            >

                                                                <div>

                                                                    <i className="ri-file-pdf-line text-danger me-2"></i>

                                                                    {file.title}

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

                                                        <p className="mb-0">
                                                            No PDFs uploaded
                                                        </p>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )}

                                </>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}