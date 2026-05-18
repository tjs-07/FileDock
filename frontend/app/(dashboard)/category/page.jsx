"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AddCategoryModal from "../../component/AddCategoryModal";



export default function Category() {

    const [showModel, setShowModel] = useState(false);

    const [categories, setCategories] = useState([]);

    const getCategories = async () => {

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/category`
            );

           setCategories(response.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteCategory = async (id) => {

        try {

            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`
            );

            console.log(response.data);

            setCategories((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {
    getCategories();
}, []);

console.log(categories);

return (

        <div className="container-fluid px-0">

            <div className="card p-5">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h4>All Category</h4>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModel(true)}
                    >
                        + Add Category
                    </button>

                </div>

                {showModel && (

                    <AddCategoryModal
                        onClose={() => setShowModel(false)}
                        refreshCategories={getCategories}
                    />

                )}

                <div className="table-responsive">

                    <table className="table table-striped">

                        <thead className="table-light">

                            <tr>
                                <th>Sr.</th>
                                <th>Name</th>
                                <th></th>
                                <th></th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {Array.isArray(categories) &&
                                categories.map((item, index) => (

                                    <tr key={item._id}>

                                        <td>{index + 1}</td>

                                        <td>{item.name}</td>

                                        <td></td>
                                        <td></td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {

                                                    if (window.confirm("Delete this category?")) {
                                                        deleteCategory(item._id)
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