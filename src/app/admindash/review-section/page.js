"use client";

import { useState, useEffect } from "react";

export default function ReviewSectionPage() {
    const [sessions, setSessions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [visibleReviews, setVisibleReviews] = useState(3); // Initially show 3 reviews

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const sessRes = await fetch("/api/sessions", { credentials: "include" });
                const sessData = await sessRes.json();
                if (sessRes.ok) {
                    setSessions(sessData);
                    console.log("Sessions fetched:", sessData);
                } else {
                    setError("Failed to fetch sessions");
                }

                const reviewRes = await fetch("/api/review?sessionId=ALL", {
                    credentials: "include",
                });
                const reviewData = await reviewRes.json();
                if (reviewRes.ok) {
                    // Sort reviews by rating in descending order
                    const sortedReviews = reviewData.sort((a, b) => b.rating - a.rating);
                    setReviews(sortedReviews);
                    console.log("Reviews fetched:", sortedReviews);
                } else {
                    setError("Failed to fetch reviews");
                }
            } catch (error) {
                setError("Error fetching data: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLoadMore = () => {
        setVisibleReviews(reviews.length); // Show all reviews
    };

    return (
        <div className="text-gray-600">
            <h2 className="text-2xl font-semibold mb-6 playfair-display-sc-regular text-gray-800">
                Review Section
            </h2>
            {loading && <p className="text-sm text-gray-600">Loading reviews...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {reviews.length === 0 && !loading && !error ? (
                <p className="text-gray-600">No reviews found.</p>
            ) : (
                <div className="flex flex-col justify-start items-center gap-4 overflow-y-auto max-h-[500px] pb-20">
                    {reviews.slice(0, visibleReviews).map((review) => (
                        <div
                            key={review._id}
                            className="bg-white w-full p-6 rounded-lg shadow-md flex items-start border border-gray-200"
                        >
                            <img
                                src="/manage.png"
                                alt="User"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className=" font-semibold text-gray-800">
                                            "{review.comment || "No comment provided."}"
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Session: {review.session?.title || "Unknown Session"}
                                        </p>

                                    </div>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <img
                                                key={star}
                                                src={
                                                    star <= review.rating
                                                        ? "/star2.svg"
                                                        : "/empty-star.svg"
                                                }
                                                alt="star"
                                                className="h-5 w-5"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="mt-2 text-sm text-gray-600">
                                    @{review.user?.username || "Anonymous"}
                                </h3>
                            </div>
                        </div>
                    ))}
                    {visibleReviews < reviews.length && (
                        <div className="text-center mt-6">
                            <button
                                onClick={handleLoadMore}
                                className="text-yellow-700 underline px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}