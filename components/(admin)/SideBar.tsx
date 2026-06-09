"use client";
import { Mails, PencilOff, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const boxes = [
  {
    icons: <Plus size={18} />,
    text: "Add blogs",
    href: "/blogPage",
  },
    {
    icons: <Plus size={18} />,
    text: "Add Test Series",
    href: "/test-series",
  },
  {
    icons: <PencilOff size={18} />,
    text: "All Students",
    href: "/students",
  },
   {
    icons: <PencilOff size={18} />,
    text: "All Blogs",
    href: "/allBlogs",
  },
  {
    icons: <PencilOff size={18} />,
    text: "Edit Test Series",
    href: "/edittestSeries",
  },{
    icons: <PencilOff size={18} />,
    text: "Add Bulk Test",
    href: "/addbulk",
  },
 
];

const SideBar = () => {
  return (
    <main className="h-screen max-w-60 border-r bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-center bg-white sticky top-0 z-10">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          height={40}
          width={40}
          className="object-cover rounded-md"
        />
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col gap-3 p-4">
        {boxes.map((box, index) => (
          <Link
            href={`/admin/${box.href}`}
            key={index}
            className="flex items-center gap-4 px-4 py-3 rounded-lg border bg-white shadow-sm hover:shadow-md hover:bg-gray-100 hover:scale-[1.02] transition cursor-pointer"
          >
            <span className="rounded-full border border-gray-400 p-2 text-gray-600">
              {box.icons}
            </span>

            <p className="text-gray-700 font-medium">{box.text}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default SideBar;
