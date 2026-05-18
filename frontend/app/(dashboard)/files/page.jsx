"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Files() {

    const [files, setFiles] = useState([]);

    const getFiles = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/file`
            );

            setFiles(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteFile = async (id) => {

        try {

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/file/${id}`
            );

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

            <div className="card p-5">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h4>All Files</h4>

                </div>

                <div className="table-responsive">

                    <table className="table table-striped">

                        <thead className="table-light">

                            <tr>

                                <th>Sr.</th>
                                <th>File</th>
                                <th>Folder</th>
                                <th>Category</th>
                                <th>View</th>
                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {files.map((item, index) => (

                                <tr key={item._id}>

                                    <td>{index + 1}</td>

                                    <td>

                                        <div className="d-flex align-items-center gap-2">

                                            <i className="ri-file-pdf-line text-danger"></i>

                                            {item.title}

                                        </div>

                                    </td>

                                    <td>
                                        {item.folderId?.name}
                                    </td>

                                    <td>
                                        {item.folderId?.categoryId?.name}
                                    </td>

                                    <td>

                                        <a
                                            href={item.fileUrl}
                                            target="_blank"
                                            className="btn btn-sm btn-primary"
                                        >
                                            View
                                        </a>

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => {

                                                if (window.confirm("Delete this file?")) {

                                                    deleteFile(item._id)

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