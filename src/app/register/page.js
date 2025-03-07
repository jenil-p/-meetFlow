"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Register() {
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/"); // Redirect to home or user dashboard if logged in
        }
    }, [status, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "authenticated") {
        return null; // User is redirected, so no need to render
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-white">Register</h1>
                {message && <p className="text-red-400 mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-white">Name:</label>
                        <input
                            className="bg-gray-700 text-white rounded-md p-2"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-white">Email:</label>
                        <input
                            className="bg-gray-700 text-white rounded-md p-2"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-white">Password:</label>
                        <input
                            className="bg-gray-700 text-white rounded-md p-2"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-white">Confirm Password:</label>
                        <input
                            className="bg-gray-700 text-white rounded-md p-2"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="bg-blue-300 text-black rounded-md p-2 w-full" type="submit">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-white">
                    Already have an account? <a href="/login" className="text-blue-300">Login here</a>
                </p>
            </div>
        </div>
    );
}