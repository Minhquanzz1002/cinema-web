import type { Metadata } from "next";
import React from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Galaxy Cinema",
  description: "Galaxy Cinema",
};

export default function DefaultLayout({
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
