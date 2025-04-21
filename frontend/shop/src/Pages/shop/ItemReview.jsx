import React, { useState } from 'react';
import ReviewPopup from './ReviewPopup';
import Pagination from '../../components/Pagination';
const ItemReview = () => {
  const [reviews, setReviews] = useState([
    { id: 1, images: ['image1.jpg', 'image1_detail1.jpg'], title: '정말 좋아요!', writer: '최**', date: '2025.04.01', rating: 5, content: '상품이 마음에 쏙 들어요. 배송도 빠르고 품질도 좋습니다!' },
    { id: 2, images: [], title: '보통이에요', writer: '김**', date: '2025.03.28', rating: 3, content: '그냥 평범한 것 같아요. 가격 대비 나쁘진 않네요.' },
    { id: 3, images: ['image2.png', 'image3.jpeg', 'image3_detail1.png'], title: '추천합니다', writer: '박**', date: '2025.03.20', rating: 4, content: '디자인도 예쁘고 사용하기도 편리합니다. 추천해요!' },
  ]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveReview = (reviewData) => {
    console.log('저장된 리뷰:', reviewData);
    setReviews([...reviews, { id: Date.now(), ...reviewData }]);
    setIsPopupOpen(false);
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? 'gold' : 'lightgray', fontSize: '1.2em', marginRight: '2px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="itemReviewsContainer">
      <h2>Reviews</h2>
      <ul className="reviewList">
        {reviews.map((review) => (
          <li key={review.id} className="reviewItem" onClick={() => handleReviewClick(review)}>
            <div className="reviewHeader">
              <div className="reviewImages">
                {review.images && review.images.length > 0 && (
                  <img src={review.images[0]} alt={`review-image-${review.id}-0`} style={{ maxWidth: '30px', maxHeight: '30px' }} />
                )}
              </div>
              <h3 className="reviewTitle">{review.title}</h3>
              <span className="reviewWriter">{review.writer}</span>
              <span className="reviewDate">{review.date}</span>
              <div className="reviewRating">{renderStars(review.rating)}</div>
            </div>
            {selectedReview && selectedReview.id === review.id && (
              <div className="reviewContent">
                {selectedReview.content}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Pagination/>

      <button className="writeReviewButton" onClick={handleOpenPopup}>
        리뷰 작성
      </button>

      {isPopupOpen && (
        <ReviewPopup onClose={handleClosePopup} onSave={handleSaveReview} />
      )}
    </div>
  );
};

export default ItemReview;