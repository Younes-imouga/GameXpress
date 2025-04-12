import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { Link } from 'react-router-dom'; 

const CategoryModal = ({ show, onClose, onSubmit, category, formData, setFormData, isSubmitting }) => {
  if (!show) return null;

  const isEditMode = !!category;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-200 text-2xl disabled:opacity-50"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                 isEditMode ? 'Updating...' : 'Creating...'
              ) : (
                 isEditMode ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Simple fade-in/scale animation */}
      <style jsx>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};



function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiProgress, setApiProgress] = useState(false); 

  
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); 
  const [formData, setFormData] = useState({ name: '', slug: '' }); 
  
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/categories');

      const categoriesArray = response.data.categories;

      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []); 

      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to load categories.');
      setCategories([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setFormData({ 
      name: category ? category.name : '', 
      slug: category ? category.slug : '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setFormData({ name: '', slug: '' }); 
    setError(null); 
  };

  
  const handleFormSubmit = async () => {
    setApiProgress(true);
    setError(null); 
    const method = currentCategory ? 'put' : 'post';
    const url = currentCategory 
      ? `/admin/categories/${currentCategory.id}` 
      : '/admin/categories';
    
    try {
      const response = await axiosInstance[method](url, formData);
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err.response?.data?.message?.name?.[0] || 'Failed to submit category.';
      console.log(errorMsg);
      
      setErrorMessage(errorMsg);
      const validationErrors = err.response?.data?.errors;
      let detailedError = errorMsg;
      if (validationErrors) {
         detailedError += " " + Object.values(validationErrors).flat().join(' ');
      }
      setError(detailedError);
      
    } finally {
      setApiProgress(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      return;
    }

    setApiProgress(true); 
    setError(null);
    try {
      await axiosInstance.delete(`/admin/categories/${categoryId}`);
      fetchCategories(); 
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Failed to delete category.');
    } finally {
      setApiProgress(false);
    }
  };

  if (loading && categories.length === 0) { 
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  const shouldShowGeneralError = error && !showModal; 

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white border-b border-green-500 pb-2 inline-block">
            Categories Management
          </h1>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
          >
            Add New Category
          </button>

        </div>

        {shouldShowGeneralError && ( 
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
         {apiProgress && (
           <div className="text-center text-blue-300 mb-4">Processing...</div>
         )}

        <div className="bg-gray-800 overflow-hidden rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{category.slug}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleOpenModal(category)} 
                          className="text-yellow-400 hover:text-yellow-300 mr-3 disabled:opacity-50"
                          disabled={apiProgress}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id, category.name)} 
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={apiProgress}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-400"> 
                      {!loading ? 'No categories found.' : 'Loading...'} 
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CategoryModal 
         show={showModal}
         onClose={handleCloseModal}
         onSubmit={handleFormSubmit}
         category={currentCategory}
         formData={formData}
         setFormData={setFormData}
         isSubmitting={apiProgress}
      />
    </div>
  );
}

export default CategoriesPage; 