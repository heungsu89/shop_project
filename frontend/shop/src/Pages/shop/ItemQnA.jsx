import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import InquiryPopup from './InquiryPopup';

const ItemQnA = () => {
  const [qnaList, setQnaList] = useState([
    { id: 1, title: '상품 문의 드립니다.', content: '언제 재입고 되나요?', writer: '최*석', status: '답변 완료', answer: '다음 주 입고 예정입니다.', isAdmin: false },
    { id: 2, title: '사이즈 문의', content: 'S사이즈 있나요?', writer: '이*호', status: '답변', answer: '현재 S사이즈는 품절입니다.', isAdmin: true },
    { id: 3, title: '배송 문의', content: '배송 언제 출발하나요?', writer: '김*민', status: '답변 대기중', answer: null, isAdmin: false },
  ]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 1, size: 5 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleWriteInquiryClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveInquiry = (title, content) => {
    console.log('문의 제목:', title, '문의 내용:', content);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const totalItems = qnaList.length;
    const itemsPerPage = 5;
    setPageInfo({ number: 0, totalPages: Math.ceil(totalItems / itemsPerPage), size: itemsPerPage });
  }, [qnaList]);

  return (
    <div className="itemQnaContainer">
      <h2>상품 문의</h2>
      {qnaList.length > 0 ? (
        <ul className="qnaList">
          <li className="qnaHeader">
            <span className="qnaNumber">번호</span>
            <span className="qnaTitle">제목 (문의 내용)</span>
            <span className="qnaWriter">작성자</span>
            <span className="qnaStatus">답변 상태</span>
          </li>
          {qnaList.map((qna) => (
            <li key={qna.id} className="qnaItem">
              <span className="qnaNumber">{qna.id}</span>
              <span className="qnaTitle">{qna.title} {qna.content ? `(${qna.content})` : ''}</span>
              <span className="qnaWriter">{qna.writer}</span>
              <span className="qnaStatus">
                {qna.isAdmin ? '답변' : qna.status}
              </span>
              {qna.answer && (
                <div className="qnaAnswer">
                  <span className="answerArrow">ㄴ</span>
                  <div className="answerContent">{qna.answer}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="noInquiries">NO INQUIRIES AT THIS TIME</p>
      )}
      <div className="qnaFooter">
        {pageInfo.totalPages > 1 && (
          <Pagination pageInfo={pageInfo} />
        )}
        <button className="writeInquiryButton" onClick={handleWriteInquiryClick}>
          문의 작성
        </button>
      </div>

      {isPopupOpen && (
        <InquiryPopup onClose={handleClosePopup} onSave={handleSaveInquiry} />
      )}
    </div>
  );
};

export default ItemQnA;