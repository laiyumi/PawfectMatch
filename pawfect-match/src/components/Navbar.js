"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex-1">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Pawfect Match
                    </Link>
                </div>
                <div className="flex-none">
                    {/* Add navigation items here in the future if needed */}
                </div>
            </div>
        </div>
    );
} 