import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosConfig'

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    out_of_stock_products: 0,
    latest_products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin/dashboard');
        console.log('Dashboard data:', response.data);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="max-w-7xl mx-auto mt-7 p-5">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-green-500 pb-2 inline-block">
          Admin Dashboard
        </h1>
        
        {/* Statistics Cards - Larger, full-width cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <StatCard 
            title="Total Products" 
            value={dashboardData.product_count || 0}
            icon={
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m0 0L4 13m8 4v-10" />
              </svg>
            }
            color="from-blue-500 to-blue-700"
            iconClass="bg-blue-600"
          />
          
          <StatCard 
            title="Total Categories" 
            value={dashboardData.category_count || 0}
            icon={
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="from-purple-500 to-purple-700"
            iconClass="bg-purple-600"
          />
          
          <StatCard 
            title="Total Users" 
            value={dashboardData.total_users || 0}
            icon={
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="from-green-500 to-green-700"
            iconClass="bg-green-600"
          />
          
          <StatCard 
            title="Available Products" 
            value={dashboardData.available_products || 0}
            icon={
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
            color="from-amber-500 to-amber-700"
            iconClass="bg-amber-600"
          />
        </div>
      </div>
  );
}

// Redesigned Stat Card Component for larger, full-width cards
const StatCard = ({ title, value, description, icon, color, iconClass }) => {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-xl shadow-lg overflow-hidden h-full`}>
      <div className="p-6 flex items-center h-full">
        <div className={`${iconClass} text-white rounded-full p-4 mr-5`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-100 text-lg font-medium mb-1">{title}</h3>
          <p className="text-4xl font-bold text-white mb-2">{value}</p>
          <p className="text-gray-200 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;