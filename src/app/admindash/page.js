"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashRedirect() {
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        router.push("/admindash/sessions");
    }, [router]);

    return null;
}