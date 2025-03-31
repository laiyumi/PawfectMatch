"use client";

import Link from "next/link";
import ThemeDropdown from "../components/ThemeDropdown";
import { Chewy } from 'next/font/google';

const chewy = Chewy({
    weight: '400',
    subsets: ['latin'],
});


export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-md py-6">
            <div className="flex-1 text-center">
                <Link href="/" className={`text-3xl font-bold text-primary ${chewy.className}`}>
                    Pawfect Match
                </Link>
            </div>
            <div className="flex-none">
                {/* <ThemeDropdown /> */}
            </div>
        </div>
    );
} 