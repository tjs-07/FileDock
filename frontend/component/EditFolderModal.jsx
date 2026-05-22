"use client";

import { useState } from "react";

import axios from "axios";

export default function EditFolderModal({
    folder,
    onClose,
    refreshFolders
}) {

    const [name, setName] = useState(folder?.name || "");

    const [loading, setLoading] = useState(false);
    const folderId = folder?.id ?? folder?._id;

    const updateFolder = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.put(
                `/api/folder/${folderId}`,
                {
                    name: name.trim()
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Folder was not updated");
            }

            refreshFolders();

            onClose();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal fade show d-block">

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">

                    {/* Header */}
                    <div className="modal-header">

                        <h5 className="modal-title">
                            Edit Folder
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    {/* Form */}
                    <form onSubmit={updateFolder}>

                        <div className="modal-body">

                            <label className="form-label">
                                Folder Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Footer */}
                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {
                                    loading
                                        ? "Updating..."
                                        : "Update"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}
