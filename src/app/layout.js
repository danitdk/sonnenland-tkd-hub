import "./globals.css";

export const metadata = {
  title: "Sonnenland TKD Hub | Taekwondo Registration & Payment Management",
  description:
    "Official Taekwondo Registration and Payment Management portal for Sonnenland International School led by Master Daniel.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0B0F19] text-gray-100 antialiased selection:bg-crimson selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
