"use client";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

const notFound = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-notFoundBgColor">
      <h1 className="text-9xl font-extrabold text-whiteColor tracking-widest">
        404
      </h1>
      <div className="bg-notFoundColor px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          className="relative inline-block text-sm font-medium text-notFoundColor group active:text-orange-500"
          href="/pages"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-notFoundColor group-hover:translate-y-0 group-hover:translate-x-0"></span>

          <span className="relative block px-8 py-3 bg-notFoundBgColor border border-current">
            <span className="text-whiteColor">Back to Main Page</span>
          </span>
        </Link>
      </button>
    </main>
  );
};

export default notFound;
