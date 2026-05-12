"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddFolderModal from "../../component/AddFolderModal";

export default function Folders() {

    const [showModal, setShowModal] = useState(false);

    const [folders, setFolders] = useState([]);

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

                                <tr key={item._id}>

                                    <td>{index + 1}</td>

                                    <td>{item.name}</td>

                                    <td>
                                        {item.categoryId?.name}
                                    </td>

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

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}