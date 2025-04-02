"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../userdash/components/Loading";

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
        if (session.user.role !== "ADMIN") {
            router.push("/userdash");
        }
    }, [session, status, router]);

    return (
        <>
        <Loading/>
        </>
    );
};

export default Page;