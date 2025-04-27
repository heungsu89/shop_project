import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getMagazineList } from "../../api/BoardApi";
import Pagination from "../Pagination";

const MagazineListComponent = () => {
  const [magazines, setMagazines] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // const startIndex = currentPage * pageSize;
  // const endIndex = startIndex + pageSize;
  // const currentMagazines = magazines.slice(startIndex, endIndex);
  // const totalPages = Math.ceil(magazines.length / pageSize);

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

  useEffect(() => {
    fetchList();
  },[page,size])


  const fetchList = () => {
    getMagazineList(page,size).then(setMagazines);
  }



  return (
    <>
      <div className="rightNavLayoutWrap">
        <section className="rightNavLayoutContainer">
          <ul className="boradListWrap innerWrap">
            {magazines?.content?.map((magazine,index) => {
              const displayIndex = magazines.totalElements - (page * size + index);

            return(
              <li key={magazine.magazineListId} className="item">
                <div className="imageContainer">
                  <img src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`} alt={`${magazine.title}`} />
                </div>
                <div className="textContainer">
                  <div className="textWrapper"> 
                    <Link to={`/magazine/detail/${magazine.magazineListId}`}>
                        <span className="volume">- VOL. {displayIndex}</span>
                        <strong className="title">
                        {magazine.title.split(/[-–]/).map((part, idx, arr) => (
                          <React.Fragment key={idx}>
                            {part.trim()}
                            {idx !== arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </strong>
                      </Link>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        </section>

        <aside className="itemSidebar">
          <div className="innerSiedbarWrap">
            <h2>MAGAZINE</h2>
            <p>NØRD documents inspiration<br /> drawn from everyday life and beyond fashion<br />
              Through interviews, essays, and visuals,<br />we explore brand philosophies and aesthetics.</p>
            <div className="searchBox">
              <input type="text" placeholder="SEARCH TEXT" />
              <button>SEARCH</button>
            </div>
            <div className="paginationContainer">
              <h3 className="totalCount">TOTAL {magazines.totalElements}</h3>
              <Pagination pageInfo={magazines} />
            </div>
          </div>
        </aside>

      </div>
    </>
  );
};

export default MagazineListComponent;