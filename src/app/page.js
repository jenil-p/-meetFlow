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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
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
                  src="/checkin.jpeg" // Replace with actual image path
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
                  src="/sch.jpg" // Replace with actual image path
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
                  src="/manage.png" // Replace with actual image path
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
                  src="/analytist.webp" // Replace with actual image path
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
        {/* footer is here.... */}
        <div className="footer bg-yellow-700 text-white py-10 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event Planning Services */}
            <div>
              <h3 className="text-xl font-semibold playfair-display-sc-regular mb-4">
                Conference Services
              </h3>
              <ul className="space-y-2">
                <li>Seamless Registration</li>
                <li>Smart Scheduling</li>
                <li>Resource Management</li>
                <li>Event Analytics</li>
              </ul>
            </div>

            {/* More Links */}
            <div>
              <h3 className="text-xl font-semibold  playfair-display-sc-regular mb-4">
                More
              </h3>
              <ul className="space-y-2 ">
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/about">Why Choose MeetFlow</Link>
                </li>
                <li>
                  <Link href="/terms">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info and Subscription */}
            <div>
              <h3 className="text-xl font-semibold playfair-display-sc-regular mb-4">
                Contact Info
              </h3>
              <p className=" mb-2">
                <span className="mr-2">📞</span>+1-800-MEETFLOW
              </p>
              <p className=" mb-4">
                <span className="mr-2">✉️</span>support@meetflow.com
              </p>
              <h3 className="text-xl font-semibold  playfair-display-sc-regular mb-4">
                Stay Connected
              </h3>
              <div className="flex space-x-4 justify-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6  hover:text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6  hover:text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <svg className="w-6 h-6  hover:text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-300 pt-4 text-center">
            <p className=" playfair-display-sc-regular">
              © 2025 MeetFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}