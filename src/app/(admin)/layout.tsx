"use client";
import React, {useState} from "react";
import "@/styles/global.admin.css";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <html lang="en">
      <body>
        <div className="w-full h-full flex bg-background-100 dark:bg-background-900">
          {children}
        </div>
      </body>
    </html>
  );
}
