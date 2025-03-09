"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
// import { cn } from "@/lib/utils";
import { cn } from "../lib/utils";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const { data: session } = useSession();

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        {/* Logo/Home */}
        <MenuItem setActive={setActive} active={active} item="MeetFlow">
          <Link href="/">Home</Link>
        </MenuItem>

        {/* Conditional rendering based on session */}
        {!session && (
          <>
            <MenuItem setActive={setActive} active={active} item="About">
              <Link href="/">About</Link>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Contact">
              <Link href="/">Contact</Link>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Log In">
              <Link href="/login">Log In</Link>
            </MenuItem>
          </>
        )}

        {session && (
          <>
            <MenuItem setActive={setActive} active={active} item="Dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Your Page">
              <Link href={`/${session.user.name}`}>Your Page</Link>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Sign Out">
              <Link href="/login" onClick={() => signOut()}>Sign Out</Link>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}

export default NavbarDemo;