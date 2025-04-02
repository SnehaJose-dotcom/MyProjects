'use client';

import { useState, useEffect } from 'react';
import ReviewForm from '@/components/ReviewForm';

const ReviewPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Get reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setReviews(storedReviews);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4E7D3] text-gray-900 py-12">
      <div className="container mx-auto px-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#6D4C41]">Customer Reviews</h2>
          <p className="text-xl text-gray-600 mt-3">See what our happy customers have to say!</p>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-[#D7A86E] rounded-lg shadow-xl transition-transform transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  {/* Review Text */}
                  <p className="italic text-gray-700 text-lg text-center mb-4">{review.review}</p>
                  {/* Reviewer Name */}
                  <p className="text-[#6D4C41] font-semibold text-lg">{review.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-xl text-center">No reviews available.</p>
          )}
        </div>

        {/* Review Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
