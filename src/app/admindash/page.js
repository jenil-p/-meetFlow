"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push("/admindash/conferences");
    }, [router]);

    return null;
}