import Script from "next/script";

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
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
        {children}
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