import "../globals.css";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import MobileMenuOverlay from "../../component/MobileMenuOverlay";
import Script from "next/script";

export const metadata = {
  title: "Investor Portal Admin",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {

  return (

    <>

      {/* CSS */}
      <link rel="stylesheet" href="/assets/vendor/css/core.css" />
      <link rel="stylesheet" href="/assets/vendor/css/theme-default.css" />
      <link rel="stylesheet" href="/assets/css/demo.css" />

      <link
        rel="stylesheet"
        href="/assets/vendor/fonts/remixicon/remixicon.css"
      />

      <link
        rel="stylesheet"
        href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"
      />

      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      {/* Layout */}
      <div className="layout-wrapper layout-content-navbar">

        <div className="layout-container">

          {/* Sidebar */}
          <Sidebar />

          {/* Main */}
          <div className="layout-page">

            {/* Navbar */}
            <Navbar />

            {/* Page */}
            <div className="content-wrapper">

              <div className="container-xxl flex-grow-1 container-p-y">

                {children}

              </div>

            </div>

          </div>

        </div>

        <MobileMenuOverlay />

      </div>

      {/* JS */}
      <Script
        src="/assets/vendor/js/helpers.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/js/config.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/vendor/libs/jquery/jquery.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/vendor/libs/popper/popper.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/vendor/js/bootstrap.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"
        strategy="afterInteractive"
      />

      <Script
        src="/assets/vendor/js/menu.js"
        strategy="afterInteractive"
      />

    </>

  );

}