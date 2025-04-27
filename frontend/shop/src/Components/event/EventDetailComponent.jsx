import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent, getEventList } from "../../api/BoardApi";
import { formatDateToDot } from "../../util/dateUtil"

const MagazineDetailComponent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const navigate = useNavigate();

  const isPrevDisabled = currentIndex === eventList.length - 1;
  const isNextDisabled = currentIndex === 0;
  const displayIndex = eventList.length - currentIndex;

  const fetchEvnetList = async () => {
    try {
      const response = await setEventList(0, 100); // 0페이지 100개 가져오기 (원하면 더 늘려도 돼)
      setEventList(response.content || []);
    } catch (error) {
      console.error("이벤트트 목록 가져오기 실패:", error);
    }
  };

  const handlePrev = () => {
    if (currentIndex < eventList.length - 1) {
      const prevId = eventList[currentIndex + 1]?.eventListId;
      navigate(`/event/detail/${prevId}`);
    }
  };
  
  const handleNext = () => {
    if (currentIndex > 0) {
      const nextId = eventList[currentIndex - 1]?.eventListId;
      navigate(`/event/detail/${nextId}`);
    }
  };
  
  const handleList = () => {
    navigate('/event/list?page=0&size=10');
  };

  useEffect(() => {
    getEvent(id).then(setEvent);
    fetchEvnetList();
  }, [id]);

  useEffect(() => {
    if (id && eventList.length > 0) {
      const index = eventList.findIndex(mag => mag.eventListId === parseInt(id));
      setCurrentIndex(index);
    }
  }, [id, eventList]);

 console.log(eventList)



 if(!event) return;
  console.log(event)

  return (
    <>
      <div className="rightNavLayoutWrap">
        <section className="rightNavLayoutContainer">
          <div className="itemContentWrap innerWrap">
            <div className="itemImage">
              <img src={`http://localhost:8081/upload/${event.uploadFileNames[0]}`} alt={event.title} />
            </div>
            <div className="itemDiscripton"
              dangerouslySetInnerHTML={{ __html: event?.content }}>
            </div>
          </div>
        </section>

        <aside className="itemSidebar borad">
          <div className="innerSiedbarWrap">
            <h2>EVENT</h2>
            <span className="number">- VOL. {displayIndex}</span>
            <h3 className="title">
              {event.title.split('').map((char, idx) => (
                <React.Fragment key={idx}>
                  {char}
                  {(char === '-' || char === '–') && <br />}
                </React.Fragment>
              ))}
            </h3>
            <span className="date">{formatDateToDot(event.date)}</span>
            <div className="pagination">
              <button onClick={handlePrev} disabled={isPrevDisabled}>PREV</button>
              <button onClick={handleList}>LIST</button>
              <button onClick={handleNext} disabled={isNextDisabled}>NEXT</button>
            </div>
          </div>
        </aside>

      </div>
    </>
  );
};

export default MagazineDetailComponent;
