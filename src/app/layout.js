import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionWraper from "./components/SessionWraper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MeetFlow",
  description: "Smarter Conference Scheduling",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d111b] text-white`}>
        <SessionWraper>
        <Navbar />
        <div className="middle">
          {children}
        </div>
        </SessionWraper>
      </body>
    </html>
  );
}
