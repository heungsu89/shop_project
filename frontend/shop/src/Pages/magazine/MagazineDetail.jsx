import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMagazine, getMagazineList } from "../../api/BoardApi";
import "../../static/css/magazine.scss";

const MagazineDetail = () => {
  const [magazine, setMagazine] = useState(null);
  const [magazineList, setMagazineList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const magazineListId = searchParams.get("id");
  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

  useEffect(() => {
    fetchMagazineListForNavigation();

    if (magazineListId) {
      fetchMagazineDetail(parseInt(magazineListId));
    }
  }, [magazineListId, page, size]);

  const fetchMagazineDetail = async (id) => {
    try {
      const data = await getMagazine(id);
      setMagazine(data);
    } catch (error) {
      console.error("상세 정보 로딩 실패", error);
    }
  };

  const fetchMagazineListForNavigation = async () => {
    try {
      const response = await getMagazineList(page, size);
      const list = response?.content || [];
      setMagazineList(list);

      const index = list.findIndex(
        (magazine) => magazine.magazineListId === parseInt(magazineListId)
      );
      setCurrentIndex(index);

      if (!magazineListId && list.length > 0) {
        navigate(
          `/magazine/detail?id=${list[0].magazineListId}&page=${page}&size=${size}`
        );
      }
    } catch (error) {
      console.error("매거진 목록 로딩 실패:", error);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = magazineList[currentIndex - 1]?.magazineListId;
      navigate(`/magazine/detail?id=${prevId}&page=${page}&size=${size}`);
    }
  };

  const handleNext = () => {
    if (
      currentIndex !== null &&
      currentIndex < magazineList.length - 1
    ) {
      const nextId = magazineList[currentIndex + 1]?.magazineListId;
      navigate(`/magazine/detail?id=${nextId}&page=${page}&size=${size}`);
    }
  };

  const handleList = () => {
    navigate(`/magazine?page=${page}&size=${size}`);
  };

  if (!magazine) {
    return <div>로딩 중...</div>;
  }


  return (
    <main className="detailMain">
      <section className="detailLeft">
        <div>
          {magazine.uploadFileNames &&
            magazine.uploadFileNames.length > 0 && (
              <img
                src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`}
                alt={magazine.title}
              />
            )}
        </div>
        <div
            dangerouslySetInnerHTML={{ __html: magazine.content }}
          />
        </section>

      <section className="detailRight">
        <div>
          <h2>MAGAZINE</h2>
          <div className="rightText">
          <div className="vol">•VOL.</div>
          <h3 className="magT">{magazine.title}</h3>
          <div className="date">
            {new Date(magazine.date).toLocaleDateString("ko-KR")}
          </div>
          </div>
        </div>

       <div className="page">
        <span onClick={handlePrev} className="PREV">PREV</span> 
        <span onClick={handleList}className="LIST">LIST</span> 
        <span onClick={handleNext}className="NEXT">NEXT</span>
       </div>
     </section>
    </main>
  );
};

export default MagazineDetail;
