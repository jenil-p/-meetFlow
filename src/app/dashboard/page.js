"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }

        if (session.user.role === "ADMIN") {
            router.push("/admindash");
        }
        if (session.user.role !== "ADMIN"){
            router.push("/userdash");
        }
    }, [session, status, router]);

    if (status === "loading" || !session) {
        return <p className="text-white text-center">Loading...</p>;
    }

    // Only render Userdash for non-admins
    return (
        <div className="min-h-screen bg-white text-black p-6">
            dashboard for user
        </div>
    );
};

export default Page;