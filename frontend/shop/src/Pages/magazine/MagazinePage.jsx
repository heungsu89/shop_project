import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import mag1 from "../../static/images/magazine/magazine1.png";
import mag2 from "../../static/images/magazine/magazine2.png";
import mag3 from "../../static/images/magazine/magazine3.png";
import mag4 from "../../static/images/magazine/magazine4.png";
import mag5 from "../../static/images/magazine/magazine5.png";
import mag6 from "../../static/images/magazine/magazine6.png";
import BasicLayout from "../../layout/BasicLayout";
import "../../static/css/magazine.scss";


const dummyMagazines = [
  { id: 1, imageUrl: mag1, volume: 10, title: "Life Behind the Stage -<br />Artist Manager Julien Drury" },
  { id: 2, imageUrl: mag2, volume: 9, title: "빛을 쌓는 옷 -<br />사진가 임한결의 렌즈 밖 이야기" },
  { id: 3, imageUrl: mag3, volume: 8, title: "Between the Waves and the Wind -<br />Surfer Lia Thompson's Ocean Style" },
  { id: 4, imageUrl: mag4, volume: 7, title: "한 권의 책처럼 -<br />북페어 디렉터 김경빈의 스타일" },
  { id: 5, imageUrl: mag5, volume: 6, title: "디테일이 말하는 공간 -<br />인테리어 디자이너 이서연의 실루엣" },
  { id: 6, imageUrl: mag6, volume: 5, title: "밸런스를 그리는 손 -<br />요가 강사 정다운의 몸과 옷" },
  // 추가적인 더미 데이터
  { id: 7, imageUrl: mag1, volume: 11, title: "Another Title 1" },
  { id: 8, imageUrl: mag2, volume: 12, title: "Another Title 2" },
  { id: 9, imageUrl: mag3, volume: 13, title: "Another Title 3" },
  { id: 10, imageUrl: mag4, volume: 14, title: "Another Title 4" },
  { id: 11, imageUrl: mag5, volume: 15, title: "Yet Another Title 1" },
  { id: 12, imageUrl: mag6, volume: 16, title: "Yet Another Title 2" },
];

const MagazinePage = () => {
  const [magazines, setMagazines] = useState(dummyMagazines);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 0;
  const pageSize = 6;
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMagazines = magazines.slice(startIndex, endIndex);
  const totalPages = Math.ceil(magazines.length / pageSize);
  const pageInfo = {
    number: currentPage,
    totalPages: totalPages,
    size: pageSize,
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  return (
    <BasicLayout>
      <main className="magazineMain">
        <section className="magazineList">
          <ul>
            {currentMagazines.map((magazine) => (
              <li key={magazine.id} className="magazineItem">
                <div className="imageContainer">
                  <img src={magazine.imageUrl} alt={`vol.${magazine.volume}`} />
                </div>
                <div className="textContainer">
                  <div className="textWrapper"> 
                    {magazine.id === 5 ? (
                      <Link to="/magazine/detail">
                        <span className="volume">- VOL. {magazine.volume}</span>
                        <h2 className="title" dangerouslySetInnerHTML={{ __html: magazine.title }} />
                      </Link>
                    ) : (
                      <>
                        <span className="volume">- VOL. {magazine.volume}</span>
                        <h2 className="title" dangerouslySetInnerHTML={{ __html: magazine.title }} />
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="magazineAside">
          <h1>MAGAZINE</h1>
          <p>NØRD documents inspiration<br /> drawn from everyday life and beyond fashion<br />
            Through interviews, essays, and visuals,<br />we explore brand philosophies and aesthetics.</p>
          <div className="searchBox">
            <input type="text" placeholder="SEARCH TEXT" />
            <button>SEARCH</button>
          </div>
          <div className="paginationContainer">
            <h3 className="totalCount">TOTAL {magazines.length}</h3>
            <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
          </div>
        </aside>
      </main>
    </BasicLayout>
  );
};

export default MagazinePage;