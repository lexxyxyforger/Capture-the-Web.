import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapShot — Web Screenshot Tool",
  description: "Capture any website screenshot instantly. Free, fast, no cap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
