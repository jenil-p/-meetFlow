"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMenu() {
  const pathname = usePathname();
  const tabs = [
    { name: "register", label: "Register for Session", path: "/userdash/register" },
    { name: "request", label: "Request Paper/Session", path: "/userdash/request" },
    { name: "registered", label: "Registered Sessions", path: "/userdash/registered" },
  ];

  return (
    <div className="mb-8">
      <nav className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-lg">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.path}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              pathname === tab.path
                ? "bg-yellow-700 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}