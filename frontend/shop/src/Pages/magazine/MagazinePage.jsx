import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import BasicLayout from "../../layout/BasicLayout";
import "../../static/css/magazine.scss";
import {getMagazineList} from "../../api/BoardApi";


const MagazinePage = () => {
  const [magazines, setMagazines] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // const startIndex = currentPage * pageSize;
  // const endIndex = startIndex + pageSize;
  // const currentMagazines = magazines.slice(startIndex, endIndex);
  // const totalPages = Math.ceil(magazines.length / pageSize);

  const page = parseInt(searchParams.get("page"));
  const size = parseInt(searchParams.get("size"));


  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  useEffect(() => {
    fetchList();
  },[page,size])


  const fetchList = () => {
    getMagazineList(page,size).then(setMagazines);
  }



  return (
    <BasicLayout>
      <main className="magazineMain">
        <section className="magazineList">
          <ul>
            {magazines?.content?.map((magazine,index) => {
              const displayIndex = magazines.totalElements - (page * size + index);

            return(
              <li key={magazine.magazineListId} className="magazineItem">
                <div className="imageContainer">
                  <img src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`} alt={`vol.${magazine.title}`} />
                </div>
                <div className="textContainer">
                  <div className="textWrapper"> 
                      <Link to="/magazine/detail">
                        <span className="volume">- VOL. {displayIndex}</span>
                        <h2 className="title">{magazine.title}</h2>
                      </Link>
                  </div>
                </div>
              </li>
            )})}
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
            <h3 className="totalCount">TOTAL {magazines.totalElements}</h3>
            <Pagination pageInfo={magazines} />
          </div>
        </aside>
      </main>
    </BasicLayout>
  );
};

export default MagazinePage;