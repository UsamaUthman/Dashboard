"use client";

/* Path: client/src/components/Navbar.tsx */

import Link from "next/link";

// icon imports for navbar
import { FaUser } from "react-icons/fa";


const Navbar = () => {
  return (
    <nav
      className="flex justify-center p-3 w-full"
      role="navigation"
      data-testid="navbar"
    >
      <div className="flex flex-row-reverse gap-[120px] justify-center p-5 bg-navBarBgCardColor rounded-2xl shadow-xl">
        <div className="flex items-center">
          <Link href="/" className="text-navBarTextColor text-lg font-bold">
            Main view
          </Link>
        </div>
        <div className="flex items-center">
          <Link href="/pages" className="mr-4 text-navBarTextColor">
            <FaUser size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
