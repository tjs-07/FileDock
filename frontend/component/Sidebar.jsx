"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {

    const pathname = usePathname();

    return (

        <aside
            id="layout-menu"
            className="layout-menu menu-vertical menu bg-menu-theme card"
        >

            {/* LOGO */}

            <div className="app-brand demo mb-4">

                <Link
                    href="/dashboard"
                    className="app-brand-link d-flex align-items-center"
                >

                    <img
                        src='/assets/img/logo.png'
                        alt="Logo"
                        style={{
                            height: "40px",
                            width: "auto"
                        }}
                    />

                </Link>

            </div>

            <div className="menu-inner-shadow mt-3"></div>

            {/* MENU */}

            <ul className="menu-inner py-1">

                {/* DASHBOARD */}

                <li className={`menu-item ${pathname === "/dashboard" ? "active" : ""}`}>

                    <Link href="/dashboard" className="menu-link">

                        <i className="menu-icon tf-icons ri-home-smile-line"></i>

                        <div>Dashboard</div>

                    </Link>

                </li>

                {/* CATEGORY */}

                <li className={`menu-item ${pathname === "/category" ? "active" : ""}`}>

                    <Link href="/category" className="menu-link">

                        <i className="menu-icon tf-icons ri-layout-2-line"></i>

                        <div>Category</div>

                    </Link>

                </li>

                {/* FOLDERS */}

                <li className={`menu-item ${pathname === "/folders" ? "active" : ""}`}>

                    <Link href="/folders" className="menu-link">

                        <i className="menu-icon tf-icons ri-folder-line"></i>

                        <div>Folders</div>

                    </Link>

                </li>

                {/* FILES */}

                <li className={`menu-item ${pathname === "/files" ? "active" : ""}`}>

                    <Link href="/files" className="menu-link">

                        <i className="menu-icon tf-icons ri-file-list-line"></i>

                        <div>Files</div>

                    </Link>

                </li>

            </ul>

        </aside>

    );

}