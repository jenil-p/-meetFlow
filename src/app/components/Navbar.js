"use client";
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Scroll handlers for each section
  const handleScrollToHero = () => {
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlesignOut = () =>{
    if(confirm("Sign out ! are you sure ?")){
      signOut();
      router.push('/login');
      return;
    }
  }
  

  return (
    <div className="bg-[#a1620796] z-10 sticky top-0 flex justify-between items-center pt-4 px-10 box-border h-16">
      <div className="logo playfair-display-sc-regular font-bold mb-4 text-black sm:text-2xl text-lg">
        <Link href={"/"}>MeetFlow</Link>
      </div>
      {!session && (
        <div className="buttons flex space-x-1">
          <ul className="flex items-center gap-4 sm:text-lg playfair-display-sc-regular font-bold mb-4 text-sm text-gray-700">
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white ho p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToHero}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToAbout}
              >
                About Us
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToServices}
              >
                Our Services
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToContact}
              >
                Contact Us
              </button>
            </li>
            <li>
              <Link
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                href={"/login"}
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      )}

      {session && (
        <div className="buttons flex space-x-1">
          <ul className="flex gap-4 items-center sm:text-lg text-sm text-gray-700">
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToHero}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToAbout}
              >
                About Us
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToServices}
              >
                Our Services
              </button>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                onClick={handleScrollToContact}
              >
                Contact Us
              </button>
            </li>
            <li>
              <Link
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button
                className="playfair-display-sc-regular hover:text-white p-2 rounded-lg transform transition-all duration-300"
                
                onClick={() => handlesignOut()}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;