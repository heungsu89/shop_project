import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMagazine, getMagazineList } from "../../api/BoardApi";
import { formatDateToDot } from "../../util/dateUtil"

const MagazineDetailComponent = () => {
  const { id } = useParams();
  const [magazine, setMagazine] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    getMagazine(id).then(setMagazine);  
  }, [id]);

 if(!magazine) return;
  console.log(magazine)

  return (
    <>
      <div className="rightNavLayoutWrap">
        <section className="rightNavLayoutContainer">
          <div className="itemContentWrap innerWrap">
            <div className="itemImage">
              <img src={`http://localhost:8081/upload/${magazine.uploadFileNames[0]}`} alt={magazine.title} />
            </div>
            <div className="itemDiscripton"
              dangerouslySetInnerHTML={{ __html: magazine?.content }}>
            </div>
          </div>
        </section>

        <aside className="itemSidebar">
          <div className="innerSiedbarWrap">
            <h2>MAGAZINE</h2>
            <strong>
              {magazine.title.split('').map((char, idx) => (
                <React.Fragment key={idx}>
                  {char}
                  {(char === '-' || char === '–') && <br />}
                </React.Fragment>
              ))}
            </strong>
            <span>{formatDateToDot(magazine.date)}</span>
          </div>
        </aside>

      </div>
    </>
  );
};

export default MagazineDetailComponent;
