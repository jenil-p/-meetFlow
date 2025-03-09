"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Userdash from "../components/Userdash/Userdash";
import Admindash from "../components/Admindash/Admindash";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return <p className="text-white text-center">Loading...</p>;
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="mx-auto">
        {role === "ADMIN" ? <Admindash /> : <Userdash />}
      </div>
    </div>
  );
};

export default Page;