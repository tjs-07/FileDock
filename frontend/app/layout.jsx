import "./globals.css";

export const metadata = {
  title: "Investor Portal",
  description: "Investor Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}