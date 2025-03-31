"use client";

import Link from "next/link";
import ThemeDropdown from "../components/ThemeDropdown";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-md py-6">
            <div className="flex-1 text-center">
                <Link href="/" className="text-2xl font-bold text-primary">
                    Pawfect Match
                </Link>
            </div>
            <div className="flex-none">
                {/* <ThemeDropdown /> */}
            </div>
        </div>
    );
} 