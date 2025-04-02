'use client';

import { useState } from 'react';

const ReviewForm = () => {
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const handleSubmit = () => {
    if (reviewText && reviewerName) {
      const newReview = {
        review: reviewText,
        name: reviewerName,
      };

      // Get existing reviews from localStorage
      const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      existingReviews.push(newReview);

      // Save updated reviews in localStorage
      localStorage.setItem('reviews', JSON.stringify(existingReviews));

      // Reset form
      setReviewText('');
      setReviewerName('');
    }
  };

  return (
    <div className="review-form max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg mt-8">
      <h2 className="text-3xl font-bold text-[#6D4C41] text-center mb-6">Submit Your Review</h2>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review..."
        rows={4}
        className="w-full p-4 border rounded-md border-[#6D4C41] focus:outline-none focus:ring-2 focus:ring-[#D7A86E] focus:border-[#D7A86E] transition duration-200 mb-6"
      />

      <input
        type="text"
        value={reviewerName}
        onChange={(e) => setReviewerName(e.target.value)}
        placeholder="Your name"
        className="w-full p-4 border rounded-md border-[#6D4C41] focus:outline-none focus:ring-2 focus:ring-[#D7A86E] focus:border-[#D7A86E] transition duration-200 mb-6"
      />

      <button
        onClick={handleSubmit}
        className="p-4 bg-[#6D4C41] text-white rounded-md font-semibold hover:bg-[#D7A86E] transition duration-300 w-full"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;
