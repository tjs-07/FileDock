"use client";

import { useRouter } from "next/navigation";
import "./FolderCard.css";

export default function FolderCard({
    item,
    color = "primary",
    categoryId,
    categoryName,
    onEdit,
    onDelete
}) {
    const router = useRouter();
    const folderId = item.id ?? item._id;

    const handleCardClick = () => {
        const params = new URLSearchParams();
        const selectedCategoryId =
            categoryId || item.category_id || item.categoryId?.id || item.categoryId?._id;
        const selectedCategoryName =
            categoryName || item.category_name || item.categoryId?.name;

        if (selectedCategoryId) params.set("categoryId", selectedCategoryId.toString());
        if (selectedCategoryName) params.set("categoryName", selectedCategoryName.toString());

        router.push(`/folders/${folderId}?${params.toString()}`);
    };

    return (

        <div className="folder-card-wrapper ">

            <div
                className="folder-card-box"
                onClick={handleCardClick}
            >

                {/* Folder SVG */}
                <svg
                    width="88"
                    height="72"
                    viewBox="0 0 88 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 18C4 14.686 6.686 12 10 12H32L40 20H78C81.314 20 84 22.686 84 26V62C84 65.314 81.314 68 78 68H10C6.686 68 4 65.314 4 62V18Z"
                        fill="#8b8fe8"
                        opacity="0.85"
                    />

                    <path
                        d="M4 18C4 14.686 6.686 12 10 12H32L38 18H4Z"
                        fill="#a8abf0"
                    />

                    <path
                        d="M4 26H84V62C84 65.314 81.314 68 78 68H10C6.686 68 4 65.314 4 62V26Z"
                        fill="#9b9eec"
                        opacity="0.7"
                    />
                </svg>

                {/* Actions */}
                <div className="folder-hover-actions">

                    <button
                        className="folder-action-btn btn-flat btn-floating waves-effect"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                        }}
                    >
                        <i className="ri-edit-line"></i>
                    </button>

                    <button
                        className="folder-action-btn btn-flat btn-floating waves-effect"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                        }}
                    >
                        <i className="ri-delete-bin-line delete-icon"></i>
                    </button>

                </div>
            </div>

            {/* Folder Name */}
            <div className="folder-name">
                <span title={item.name}>
                    {item.name}
                </span>
            </div>

        </div>
    );

}
