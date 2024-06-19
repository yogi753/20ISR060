import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Laptop');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4NzA1Njg5LCJpYXQiOjE3MTg3MDUzODksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc3YTNjZTEwLTJhNTAtNGM4ZS05MjY0LTUzZjU2OTI2MDY4ZiIsInN1YiI6Inlva2VzaHIuMjBtc2NAa29uZ3UuZWR1In0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI3N2EzY2UxMC0yYTUwLTRjOGUtOTI2NC01M2Y1NjkyNjA2OGYiLCJjbGllbnRTZWNyZXQiOiJ6a1N1ckdtdlFPVVFXcGRDIiwib3duZXJOYW1lIjoiWW9rZXNoIiwib3duZXJFbWFpbCI6Inlva2VzaHIuMjBtc2NAa29uZ3UuZWR1Iiwicm9sbE5vIjoiMjBJU1IwNjAifQ.r6FbJy5djxnJv2v3oAtsUVmHV6TUTAdjx_segNd02Bg';
      const response = await axios.get(
        `http://localhost:3001/api/companies/AMZ/categories/${category}/products`,
        {
          params: {
            top: 10,
            minPrice: 1,
            maxPrice: 10000,
            sort_by: 'rating',
            order: 'desc'
          },
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`
          }
        }
      );
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Top Products in {category}</h1>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
          <option value="Tablet">Tablet</option>
          <option value="Headset">Headset</option>
          {/* Add more categories as needed */}
        </select>
      </label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Price</th>
              <th>Rating</th>
              <th>Discount</th>
              <th>Availability</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.price}</td>
                <td>{product.rating}</td>
                <td>{product.discount}</td>
                <td>{product.availability}</td>
                <td>{product.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;