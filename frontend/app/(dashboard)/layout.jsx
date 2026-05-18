import "../globals.css";
import Script from "next/script";

import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import MobileMenuOverlay from "../../component/MobileMenuOverlay";

export const metadata = {
  title: "Investor Portal Admin",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="light-style layout-navbar-fixed layout-menu-fixed layout-compact"
      dir="ltr"
      data-theme="theme-default"
      data-assets-path="/assets/"
      data-template="vertical-menu-template"
    >
      <head>

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

      </head>

      <body>

        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="layout-page">

              {/* Navbar */}
              <Navbar />

              {/* Dynamic Page Content */}
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
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/js/config.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/vendor/libs/jquery/jquery.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/vendor/libs/popper/popper.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/vendor/js/bootstrap.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/vendor/js/menu.js"
          strategy="beforeInteractive"
        />

      </body>
    </html>
  );
}
