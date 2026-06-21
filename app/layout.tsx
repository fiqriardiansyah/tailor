import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tailor CV",
  description: "Measured fit, ready to send",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
