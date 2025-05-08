<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  return (
    <BasicLayout>
      <div>
        <h2>상품 검색</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit">검색</button>
        </form>
      </div>
    </BasicLayout>
  );
};

=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    } else {
      alert('검색어를 입력해주세요.');
    }
  };

  return (
    <BasicLayout>
      <div>
        <h2>상품 검색</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit">검색</button>
        </form>
      </div>
    </BasicLayout>
  );
};

>>>>>>> 6c80c21440fd34d348db1950f2af8e1e895ca51a
export default SearchPage;