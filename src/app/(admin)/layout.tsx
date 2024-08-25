import type { Metadata } from "next";
import React, {useState} from "react";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "Galaxy Cinema | Admin",
  description: "Galaxy Cinema",
};

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

        </div>
      </body>
    </html>
  );
}
