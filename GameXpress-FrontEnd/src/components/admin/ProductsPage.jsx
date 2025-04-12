import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Link } from 'react-router-dom';

function ProductsPage() {
  
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin/products');
        console.log('Products data:', response.data);
        
        const combinedProducts = [
          ...(response.data.products || []),
          ...(response.data['out Of stock'] || [])
        ].map(product => ({
          ...product,
          
          isOutOfStock: (response.data['out Of stock']?.some(p => p.id === product.id) || product.stock === 0)
        }));
        
        setAllProducts(combinedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load products. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      let response = await axiosInstance.delete(`/admin/products/${productId}`);
      setAllProducts(allProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6 rounded shadow-md mx-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white border-b border-green-500 pb-2 inline-block">
            Products Management
          </h1>
          <Link 
            to="/admin/products/create" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
          >
            Add New Product
          </Link>
        </div>

        {/* Products Table - Simplified */}
        <div className="bg-gray-800 overflow-hidden rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              {/* Simplified Header - No sorting */}
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {/* Directly map over allProducts */}
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <tr key={product.id} className={`transition-colors ${
                      product.isOutOfStock ? 'bg-red-900 bg-opacity-20 hover:bg-red-900 hover:bg-opacity-30' : 'hover:bg-gray-750'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-600 mr-3 flex items-center justify-center text-gray-400">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-100">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          !product.isOutOfStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {!product.isOutOfStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/admin/products/${product.id}/edit`} 
                          className="text-yellow-400 hover:text-yellow-300 mr-3"
                        >
                          Edit
                        </Link>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                              handleDelete(product.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* Adjusted colspan */}
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination and Search bar removed */}
      </div>
    </div>
  );
}

export default ProductsPage; 