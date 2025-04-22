import React, { useState, useEffect } from 'react';

const ItemDetails = ({ itemId }) => {
  const [itemDescription, setItemDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDescription = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/items/${itemId}`);
        if (!response.ok) {
          throw new Error(`status: ${response.status}`);
        }
        const data = await response.json();
        setItemDescription(data.item_description);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDescription();
    }
  }, [itemId]);

  if (loading) {
    return <div>로딩 중</div>;
  }

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  if (itemDescription) {
    return (
      <div>
        <p>{itemDescription}</p>
      </div>
    );
  }

  return null;
}

export default ItemDetails;