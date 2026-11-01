import "./FileCard.css";

export default function FileCard({
    item,
    index,
    getFilePath,
    canViewFile = () => true,
    deleteFile
}) {
    const fileId = item.id ?? item._id;
    const fileName = item.name ?? item.title;

    return (

        <div className="file-card-wrapper">

            <div className="file-card-box">

                {/* File SVG */}
                <div className="file-card-icon">

    <i className="ri-file-pdf-2-fill pdf-file-icon"></i>

</div>

                {/* Hover Actions */}
                <div className="file-hover-actions">

                    {canViewFile(item) ? (
                        <a
                            href={getFilePath(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-action-btn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="ri-eye-line"></i>
                        </a>
                    ) : (
                        <button
                            type="button"
                            className="file-action-btn"
                            disabled
                            title="File URL is missing. Please re-upload this file."
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="ri-eye-off-line"></i>
                        </button>
                    )}

                    <button
                        className="file-action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Delete this file?")) {
                                deleteFile(fileId);
                            }
                        }}
                    >
                        <i className="ri-delete-bin-line file-delete-icon"></i>
                    </button>

                </div>

            </div>

            <div className="file-name">
                <span title={fileName}>
                    {fileName}
                </span>
            </div>

        </div>

    );
}
