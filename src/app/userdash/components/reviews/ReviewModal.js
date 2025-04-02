import React from "react";
import { toast } from "react-toastify";

export default function ReviewModal({
  selectedSession,
  setSelectedSession,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  comment,
  setComment,
  handleReviewSubmit,
}) {
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    await handleReviewSubmit(e);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => setSelectedSession(null)}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-500 scale-0 animate-modal-open">
        <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
          Rate "{selectedSession.title}"
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Rating (1-5)</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform duration-200 transform hover:scale-125"
                >
                  <svg
                    className={`h-8 w-8 ${
                      (hoverRating || rating) >= star ? "text-yellow-500" : "text-gray-300"
                    } transition-colors duration-200`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-700"
              rows="4"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-all duration-200"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setSelectedSession(null)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}