// src/components/Navbar.tsx
"use client";
import React from "react";
import { Link } from "react-router-dom";
import DevoteLogo from "./IamSittingLogo";

export default function Navbar() {
    return (
        <nav className="bg-[#1B3C2B] shadow-lg">
            <div className="max-w-screen-lg mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center">
                        <DevoteLogo showText variant="full" className="w-8 h-8" />
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-[#E8F5E8] hover:text-[#A3C9A3] transition-colors">
                            Home
                        </Link>
                        <Link to="/blog" className="text-[#E8F5E8] hover:text-[#A3C9A3] transition-colors">
                            Blog
                        </Link>
                        <Link to="/about" className="text-[#E8F5E8] hover:text-[#A3C9A3] transition-colors">
                            About
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}