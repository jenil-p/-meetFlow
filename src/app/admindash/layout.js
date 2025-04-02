"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import Loading from "../userdash/components/Loading";

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "ADMIN") {
            window.location.href = "/login";
        }
    }, [session, status]);

    if (status === "loading") {
        return <Loading/>
    }

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 playfair-display-sc-regular">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Navigation Menu */}
                <div className="mb-8">
                    <nav className="flex flex-wrap gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                        {[
                            { name: "sessions", label: "Sessions" },
                            { name: "conferences", label: "Conferences" },
                            { name: "review-section", label: "Review Section" },
                            { name: "rooms-resources", label: "Rooms Resources" },
                            { name: "papers", label: "Papers" },
                            { name: "permissions", label: "Permissions" },
                        ].map((tab) => (
                            <Link
                                key={tab.name}
                                href={`/admindash/${tab.name}`}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                                    pathname === `/admindash/${tab.name}`
                                        ? "bg-yellow-700 text-white shadow-lg"
                                        : "bg-white text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Calendar */}
                    <div className="lg:col-span-1 sticky top-6 bg-gray-100 p-4 rounded-lg shadow-md max-h-[400px]">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                            Event Calendar
                        </h2>
                        <Calendar
                            className="w-full border-none"
                            tileClassName={({ date }) => {
                                return "hover:bg-gray-200 rounded-md transition-colors duration-200";
                            }}
                        />
                    </div>

                    {/* Content  */}
                    <div className="lg:col-span-2 bg-gray-100 p-6 rounded-lg shadow-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}