import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/admin/products/${id}`);
        const product = response.data.products[0];

        // Ensure images is always an array
        setProductData({
          name: product.name,
          price: product.price,
          stock: product.stock,
          category_id: product.category_id,
          images: product.images || [] // Default to an empty array if undefined
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setErrorMessage('Failed to load product data.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/admin/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData({ ...productData, images: files});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Product data:', productData);

    const formData = new FormData();

    for (const key in productData) {
        if (key === 'images') {
            for (let i = 0; i < productData.images.length; i++) {
                formData.append('images[]', productData.images[i]);
            }
        } else {
            formData.append(key, productData[key]);
          }
        }
        formData.append("_method", "put");

    console.log('Submitting form data:', Object.fromEntries(formData));

    try {
        const response = await axiosInstance.post(`/admin/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        
      );
        setSuccessMessage(response.data.message)
        setErrorMessage('');
        navigate('/admin/products');

    } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to update product.');
        setSuccessMessage('');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Edit Product</h2>
        {successMessage && (
          <div className="bg-green-800 border border-green-600 text-green-100 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {errorMessage.name && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage.name}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {errorMessage.price && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage.price}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {errorMessage.stock && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage.stock}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Category</label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {errorMessage.category_id && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage.category_id}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Current Images</label>
            <div className="flex flex-wrap">
              {productData.images.map((image, index) => (
                <div key={index} className="relative mr-2 mb-2">
                  <img
                    src={import.meta.env.VITE_API_IMAGE_URL + image.image_url}
                    alt={`Product Image ${index + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    onClick={() => {
                      const updatedImages = productData.images.filter((_, i) => i !== index);
                      setProductData({ ...productData, images: updatedImages });
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">New Images</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              multiple
            />
          </div>
          {errorMessage.images && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage.images}</span>
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;