<<<<<<< HEAD
import React, { useState } from 'react';

const ReviewPopup = ({ onClose, onSave }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0);

  const handleTitleChange = (event) => {
    setReviewTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length <= 4) {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    } else {
      alert('이미지는 최대 4개까지 첨부 가능합니다.');
    }
  };

  const handleRatingChange = (newRating) => {
    if (Number.isInteger(newRating) && newRating >= 1 && newRating <= 5) {
      setRating(newRating);
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleSaveClick = () => {
    const reviewData = {
      title: reviewTitle,
      content: reviewContent,
      images: images,
      rating: rating,
    };
    onSave(reviewData);
  };

  return (
    <div className="popupBox">
      <div className="popupContainer">
        <div className="popupHeader">
          <h2>Review</h2>
        </div>
        <div className="addImageSection">
          <div className="imagePreview">
            {images.map((image, index) => (
              <div key={index} className="previewImage">
                <img src={image} alt={`preview-${index}`} />
              </div>
            ))}
          </div>
          <label htmlFor="imageInput" className="addImageButton">
            ADD IMAGE
          </label>
          <input
            id="imageInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="ratingSection">
          별점:
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`starButton ${star <= rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              {star}
            </button>
          ))}
        </div>
        <div className="inputTitleBox">
          <input
            type="text"
            placeholder="리뷰 제목을 입력해주세요."
            value={reviewTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div className="inputContentBox">
          <textarea
            placeholder="리뷰 내용을 입력해주세요."
            value={reviewContent}
            onChange={handleContentChange}
          />
        </div>
        <div className="buttonBox">
          <button className="cancelButton" onClick={handleCancelClick}>
            CANCEL
          </button>
          <button className="saveButton" onClick={handleSaveClick}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}

=======
import React, { useState } from 'react';

const ReviewPopup = ({ onClose, onSave }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0);

  const handleTitleChange = (event) => {
    setReviewTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length <= 4) {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    } else {
      alert('이미지는 최대 4개까지 첨부 가능합니다.');
    }
  };

  const handleRatingChange = (newRating) => {
    if (Number.isInteger(newRating) && newRating >= 1 && newRating <= 5) {
      setRating(newRating);
    }
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleSaveClick = () => {
    const reviewData = {
      title: reviewTitle,
      content: reviewContent,
      images: images,
      rating: rating,
    };
    onSave(reviewData);
  };

  return (
    <div className="popupBox">
      <div className="popupContainer">
        <div className="popupHeader">
          <h2>Review</h2>
        </div>
        <div className="addImageSection">
          <div className="imagePreview">
            {images.map((image, index) => (
              <div key={index} className="previewImage">
                <img src={image} alt={`preview-${index}`} />
              </div>
            ))}
          </div>
          <label htmlFor="imageInput" className="addImageButton">
            ADD IMAGE
          </label>
          <input
            id="imageInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="ratingSection">
          별점:
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`starButton ${star <= rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              {star}
            </button>
          ))}
        </div>
        <div className="inputTitleBox">
          <input
            type="text"
            placeholder="리뷰 제목을 입력해주세요."
            value={reviewTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div className="inputContentBox">
          <textarea
            placeholder="리뷰 내용을 입력해주세요."
            value={reviewContent}
            onChange={handleContentChange}
          />
        </div>
        <div className="buttonBox">
          <button className="cancelButton" onClick={handleCancelClick}>
            CANCEL
          </button>
          <button className="saveButton" onClick={handleSaveClick}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}

>>>>>>> 6c80c21440fd34d348db1950f2af8e1e895ca51a
export default ReviewPopup;