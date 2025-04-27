import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import BasicLayout from "../../layout/BasicLayout";
import { getEventList } from "../../api/BoardApi";


const EventPage = () => {
  const [events, setEvents] = useState([]);
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
    getEventList(page,size).then(setEvents);
  }



  return (
    <BasicLayout>
        <section className="magazineList">
          <ul>
            {events?.content?.map((magazine,index) => {
              const displayIndex = magazines.totalElements - (page * size + index);
              magazine.title.split('-').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  {part.trim()}
                  {idx !== arr.length - 1 && <br />}
                </React.Fragment>
              ))
            return(
              <li key={magazine.magazineListId} className="magazineItem">
                <div className="imageContainer">
                  <img src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`} alt={`•vol.${magazine.title}`} />
                </div>
                <div className="textContainer">
                  <div className="textWrapper"> 
                      <Link to="/magazine/detail">
                        <span className="volume">- VOL. {displayIndex}</span>
                        <strong className="title">  {magazine.title.split('-').map((part, idx) => (
                            <React.Fragment key={idx}>
                            {part.trim()}
                            {idx < magazine.title.split('-').length - 1 && <br />}
                            </React.Fragment>
                        ))}</strong>
                      </Link>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        </section>

        <aside className="magazineAside">
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
        </aside>
    </BasicLayout>
  );
};

export default EventPage;