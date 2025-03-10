"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            if (entry.target.querySelector(".animate-fade-in-delay")) {
              entry.target.querySelector(".animate-fade-in-delay").classList.add("animate-fade-in-delay");
            }
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return (
    <>
      <div>
        {/* Hero Section */}
        <div id="hero-section" className="herosection bg-white h-screen w-full flex items-center justify-center">
          <div className="search-sec h-full w-1/2 flex items-center justify-center p-10 text-white">
            <div className="text-center">
              <h1 className="text-6xl playfair-display-sc-regular font-bold mb-4 text-black">
                Connect & Thrive with MeetFlow
              </h1>
              <p className="text-xl mb-6 playfair-display-sc-regular text-gray-600">
                Streamline your conference experience with seamless registration, session scheduling, and resource management. Capture participant details, manage sessions, and allocate resources effortlessly.
              </p>
              {session && (
                <Link
                  href={"/dashboard"}
                  className="bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-800 transition"
                >
                  Get Started
                </Link>
              )}
              {!session && (
                <Link
                  href={"/login"}
                  className="bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-800 transition"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
          <div className="image h-full w-1/2">
            <img className="h-full object-cover mask-image-linear" src="/conf-hall.jpg" alt="" />
          </div>
        </div>

        {/* About Us Section */}
        <div id="about-us" ref={aboutRef} className="about-us-section bg py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl playfair-display-sc-regular font-bold text-gray-800 mb-6">
              About MeetFlow
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              MeetFlow is your all-in-one solution for organizing and managing conferences with ease. Designed to empower organizers and attendees, we provide seamless registration, intelligent session scheduling, and efficient resource allocation. Our mission is to connect professionals, foster collaboration, and ensure every event thrives with excellence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Seamless Registration</h3>
                <p className="text-gray-600">Capture participant details and generate unique IDs effortlessly.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Smart Scheduling</h3>
                <p className="text-gray-600">Manage sessions, workshops, and presentations with precision.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Resource Management</h3>
                <p className="text-gray-600">Allocate rooms, projectors, and AV equipment seamlessly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Services Section */}
        <div id="services-section" className="services-section bg-gray-50 py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl playfair-display-sc-regular font-bold text-gray-800 mb-6">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore the comprehensive services we offer to make your conference a success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="/luxury-bed.jpg" // Replace with actual image path
                  alt="Seamless Registration"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <p className="text-yellow-600 font-semibold mb-2">$100 per event</p>
                  <h3 className="text-xl font-semibold text-gray-800">Seamless Registration</h3>
                  <p className="text-gray-600">Effortlessly capture participant details and generate unique IDs.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="/duel-bed.jpg" // Replace with actual image path
                  alt="Smart Scheduling"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <p className="text-yellow-600 font-semibold mb-2">$100 per event</p>
                  <h3 className="text-xl font-semibold text-gray-800">Smart Scheduling</h3>
                  <p className="text-gray-600">Manage sessions and presentations with precision.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="/single-bed.jpg" // Replace with actual image path
                  alt="Resource Management"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <p className="text-yellow-600 font-semibold mb-2">$100 per event</p>
                  <h3 className="text-xl font-semibold text-gray-800">Resource Management</h3>
                  <p className="text-gray-600">Allocate rooms and equipment seamlessly.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="/family-room.jpg" // Replace with actual image path
                  alt="Event Analytics"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <p className="text-yellow-600 font-semibold mb-2">$100 per event</p>
                  <h3 className="text-xl font-semibold text-gray-800">Event Analytics</h3>
                  <p className="text-gray-600">Gain insights with detailed participant and session analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div id="contact-us" className="contact-us-section bg-gray-100 py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl playfair-display-sc-regular font-bold text-gray-800 mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions or need support? Reach out to us! Our team is here to assist with your conference needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Email Us</h3>
                <p className="text-gray-600">support@meetflow.com</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Call Us</h3>
                <p className="text-gray-600">+1-800-MEETFLOW</p>
              </div>
            </div>
            <button className="mt-8 bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-800 transition">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
}