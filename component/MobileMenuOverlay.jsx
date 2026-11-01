"use client";

export default function MobileMenuOverlay() {
    const closeMobileMenu = () => {
        document.documentElement.classList.remove("layout-menu-expanded");
    };

    return (
        <div
            className="layout-overlay layout-menu-toggle"
            onClick={closeMobileMenu}
        ></div>
    );
}
