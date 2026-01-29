import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Period Tracker",
  description: "A minimalist period tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
