"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Userdash from "../components/Userdash";
import Admindash from "../components/Admindash";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <p>Loading...</p>;
  }

  const role = session.user.role; // Assuming role is added to session
  console.log("Current role:", role);

  return (
    <div>
      {role === "ADMIN" ? <Admindash /> : <Userdash />}
    </div>
  );
};

export default Page;