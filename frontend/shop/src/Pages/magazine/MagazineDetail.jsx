import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getMagazine, getMagazineList } from "../../api/BoardApi";

const MagazineDetail = () => {
  const [magazine, setMagazine] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [magazineList, setMagazineList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;
  const magazineListId = parseInt(searchParams.get("id"));

  console.log("렌더링");

  useEffect(() => {
    if (magazineListId) {
      console.log("로딩 시작");
      fetchMagazineDetail(magazineListId);
    }
    console.log("로딩 시작");
    fetchMagazineListForNavigation();
  }, [magazineListId, page, size]);

  const fetchMagazineDetail = async (id) => {
    try {
      const data = await getMagazine(id);
      console.log("상세 정보 로딩 완료");
      setMagazine(data);
    } catch (error) {
      console.error("상세 정보 로딩 실패", error);
    }
  };

  const fetchMagazineListForNavigation = async () => {
    try {
      const response = await getMagazineList(page, size);
      setMagazineList(response?.content || []);
      const index = response?.content?.findIndex(
        (item) => item.magazineListId === magazineListId
      );
      setCurrentIndex(index);
      console.log("로딩 완료");
    } catch (error) {
      console.error("로딩 실패:", error);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = magazineList[currentIndex - 1]?.magazineListId;
      if (prevId) {
        navigate(`/magazine/detail?id=${prevId}&page=${page}&size=${size}`);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < magazineList.length - 1) {
      const nextId = magazineList[currentIndex + 1]?.magazineListId;
      if (nextId) {
        navigate(`/magazine/detail?id=${nextId}&page=${page}&size=${size}`);
      }
    }
  };

  const handleList = () => {
    navigate(`/magazine?page=${page}&size=${size}`);
  };

  if (!magazine) {
    return <div>로딩 중...</div>;
  }

  const displayIndex = magazineList.length - (page * size + (currentIndex !== null ? currentIndex : 0));

  return (
    <>
      {/* 왼쪽 */}
      <main>
        <section>
          <div>
            {magazine.uploadFileNames && magazine.uploadFileNames.length > 0 && (
              <img
                src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`}
                alt={magazine.title}
              />
            )}
          </div>

          <section>
            <div>{magazine.content}</div>
          </section>

          {/* 오른쪽 */}
          <div>
            <div>. VOL. {displayIndex}</div>
            <h2>{magazine.title}</h2>
            <div>{new Date(magazine.date).toLocaleDateString()}</div>
          </div>
        </section>

        <div>
          <span onClick={handlePrev}>PREV</span> |
          <span onClick={handleList}>LIST</span> |
          <span onClick={handleNext}>NEXT</span>
        </div>
      </main>
    </>
  );
};

export default MagazineDetail;