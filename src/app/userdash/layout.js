"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavMenu from "./components/NavMenu";
import UserInfo from "./components/UserInfo";

export default function UserdashLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-gray-800 text-center">Loading...</p>;
  }

  if (!session || session.user.role !== "USER") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
        <h1 className="text-4xl playfair-display-sc-regular font-bold mb-6 text-gray-800">
          User Dashboard
        </h1>
        <NavMenu />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserInfo user={session.user} />
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}