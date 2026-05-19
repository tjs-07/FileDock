"use client";

import FileCard from "../../../component/FileCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

    const [stats, setStats] = useState({

        totalCategories: 0,
        totalFolders: 0,
        totalFiles: 0

    });

    const deleteFile = async (id) => {

        try {

            await axios.delete(`/api/file/${id}`);

            setRecentFiles((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    const [recentFiles, setRecentFiles] = useState([]);

    const getDashboardData = async () => {

        try {

            const statsResponse = await axios.get(
                "/api/dashboard-stats"
            );

            setStats(statsResponse.data);

            const filesResponse = await axios.get(
                "/api/recent-files"
            );

            setRecentFiles(filesResponse.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const getFilePath = (file) =>
        file.publicId
            ? `/${file.publicId.split("/").map(encodeURIComponent).join("/")}`
            : `/api/file/${file._id}`;

    return (

        <div className="container-fluid px-0">

            {/* HEADING */}

            <div className="mb-4">

                <h3 className="mb-1">
                    Welcome Back
                </h3>

                <p className="text-muted mb-0">
                    Investor Portal Dashboard
                </p>

            </div>

            {/* STATISTICS */}

            <div className="row">

                {/* CATEGORY */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total Categories
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalCategories}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#e8f2ff"
                                    }}
                                >

                                    <i
                                        className="ri-layout-2-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#0d6efd"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FOLDER */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total Folders
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalFolders}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#fff3e6"
                                    }}
                                >

                                    <i
                                        className="ri-folder-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#ff9800"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* FILES */}

                <div className="col-md-4 mb-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <p className="mb-1 text-muted">
                                        Total PDFs
                                    </p>

                                    <h3 className="mb-0">
                                        {stats.totalFiles}
                                    </h3>

                                </div>

                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "55px",
                                        height: "55px",
                                        backgroundColor: "#ffecec"
                                    }}
                                >

                                    <i
                                        className="ri-file-pdf-line"
                                        style={{
                                            fontSize: "24px",
                                            color: "#f44336"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* RECENT FILES */}

            <div className="card">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h5 className="mb-0">
                            Recent Uploaded Files
                        </h5>

                    </div>

                </div>

                    <div className="row">

                        {recentFiles.map((item, index) => (

                            <FileCard
                                key={item._id}
                                item={item}
                                index={index}
                                getFilePath={getFilePath}
                                deleteFile={deleteFile}
                            />

                        ))}

                    </div>

                

            </div>

        </div>

    );

}
