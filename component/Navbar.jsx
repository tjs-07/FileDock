"use client";

export default function Navbar() {

  const toggleMobileMenu = () => {
    document.documentElement.classList.toggle("layout-menu-expanded");
  };

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
        <button
          type="button"
          className="nav-item nav-link px-0 me-xl-6 btn btn-link"
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          <i className="ri-menu-fill ri-22px"></i>
        </button>
      </div>

      <div
        className="navbar-nav-right d-flex align-items-center"
        id="navbar-collapse"
      >

        {/* Search */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item navbar-search-wrapper mb-0">
            <a
              className="nav-item nav-link search-toggler fw-normal px-0"
              href="#"
            >
              <i className="ri-search-line ri-22px scaleX-n1-rtl me-3"></i>

              <span className="d-none d-md-inline-block text-muted">
                Search (Ctrl+/)
              </span>
            </a>
          </div>
        </div>

        <ul className="navbar-nav flex-row align-items-center ms-auto">

          {/* Theme Switcher */}
          <li className="nav-item dropdown-style-switcher dropdown me-1 me-xl-0">
            <a
              className="nav-link btn btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i className="ri-22px"></i>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  data-theme="light"
                >
                  <span className="align-middle">
                    <i className="ri-sun-line ri-22px me-3"></i>
                    Light
                  </span>
                </a>
              </li>

              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  data-theme="dark"
                >
                  <span className="align-middle">
                    <i className="ri-moon-clear-line ri-22px me-3"></i>
                    Dark
                  </span>
                </a>
              </li>

              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  data-theme="system"
                >
                  <span className="align-middle">
                    <i className="ri-computer-line ri-22px me-3"></i>
                    System
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Search Input */}
      <div className="navbar-search-wrapper search-input-wrapper d-none">
        <input
          type="text"
          className="form-control search-input container-xxl border-0"
          placeholder="Search..."
          aria-label="Search..."
        />

        <i className="ri-close-fill search-toggler cursor-pointer"></i>
      </div>
    </nav>
  );
}