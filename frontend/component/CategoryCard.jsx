"use client";
import { useRouter } from "next/navigation";

export default function CategoryCard({
    item,
    index,
    color,
    onEdit,
    onDelete
}) {
    const router = useRouter();
    const categoryId = item.id ?? item._id;

    return (

        <div className="col-lg-3 col-sm-6">

            <div className="card category-card cursor-pointer"
                onClick={() => router.push(
                    `/folders?categoryId=${categoryId}&categoryName=${encodeURIComponent(item.name)}`
                )}
            >

                <div className="card-body">

                    <div className="d-flex align-items-center justify-content-between">

                        {/* Left */}
                        <div className="d-flex align-items-start">

                            <div className="avatar me-3">

                                <div
                                    className={`avatar-initial bg-label-primary rounded-3`}
                                >

                                    <span className="category-icon">
                                        <i className="ri-gallery-view-2"></i>
                                    </span>

                                </div>

                            </div>

                            <div className="card-info">

                                <div className="d-flex align-items-center">

                                    <h6 className="mb-0 category-name">
                                        {item.name}
                                    </h6>

                                </div>

                                <small className="text-muted">
                                    Category #{index + 1}
                                </small>

                            </div>

                        </div>

                        {/* Actions */}
                        <div className="category-actions">

                            {/* Edit */}
                            <button
                                className="btn btn-sm btn-icon btn-text-secondary edit-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(item);
                                }}
                            >
                                <i className="ri-edit-line"></i>
                            </button>

                            {/* Delete */}
                            <button
                                className="btn btn-sm btn-icon btn-text-danger delete-btn"
                                onClick={(e) => {

                                    e.stopPropagation();

                                    onDelete(categoryId);

                                }}
                            >
                                <i className="ri-delete-bin-line"></i>
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
