import "../app/(dashboard)/files/files.css";

export default function FileCard({
    item,
    index,
    getFilePath,
    canViewFile = () => true,
    deleteFile
}) {

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

        <div className="col-sm-6 col-lg-3 mb-4">

            <div className={`card card-border-shadow-${color} h-100 file-card`}>

                <div className="card-body">

                    {/* Top */}
                    <div className="d-flex align-items-start justify-content-between mb-3">

                        {/* File Info */}
                        <div className="d-flex align-items-center">

                            <div className="avatar me-3">

                                <span className={`avatar-initial rounded-3 bg-label-${color}`}>

                                    <i className="ri-file-pdf-line ri-24px"></i>

                                </span>

                            </div>

                            <div>

                                <h6
                                    className="mb-1 fw-semibold text-break"
                                    style={{
                                        wordBreak: "break-word",
                                        whiteSpace: "normal",
                                        lineHeight: "1.4"
                                    }}
                                >
                                    {item.title}
                                </h6>

                            </div>

                        </div>

                        {/* Actions */}
                        <div className="file-actions">

                            {/* View */}
                            {canViewFile(item) ? (
                                <a
                                    href={getFilePath(item)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-icon btn-text-primary"
                                >

                                    <i className="ri-eye-line"></i>

                                </a>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-text-secondary"
                                    disabled
                                    title="File URL is missing. Please re-upload this file."
                                >
                                    <i className="ri-eye-off-line"></i>
                                </button>
                            )}

                            {/* Delete */}
                            <button
                                className="btn btn-sm btn-icon btn-text-danger"
                                onClick={() => {

                                    if (window.confirm("Delete this file?")) {

                                        deleteFile(item._id);

                                    }

                                }}
                            >

                                <i className="ri-delete-bin-line"></i>

                            </button>

                        </div>

                    </div>

                    {/* Category + Folder */}
                    <div className="mt-3 d-flex align-items-start gap-4">

                        {/* Category */}
                        <div>

                            <small className="text-muted d-block mb-1">

                                Category

                            </small>

                            <span className="badge bg-label-primary">

                                {item.folderId?.categoryId?.name}

                            </span>

                        </div>

                        {/* Folder */}
                        <div>

                            <small className="text-muted d-block mb-1">

                                Folder

                            </small>

                            <span className="badge bg-label-info">

                                {item.folderId?.name}

                            </span>

                        </div>

                    </div>

                    {!item.publicId && item.fileUrl?.includes("onrender.com/uploads/") && (

                        <div className="alert alert-warning py-2 px-3 mt-3 mb-0 small">
                            Re-upload required
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}
