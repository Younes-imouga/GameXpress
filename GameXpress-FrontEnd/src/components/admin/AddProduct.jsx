import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../axiosConfig';

function AddProduct() {
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
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/admin/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        setProductData({ ...productData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

        try {
            const response = await axiosInstance.post('/admin/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to add product.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Add New Product</h2>
                {errorMessage && (
                    <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}
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
                    <div className="mb-4">
                        <label className="block text-gray-300 font-semibold mb-2">Images</label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            multiple
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;