import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Master from "../layout/Master.jsx";

import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import { useAuth } from "../utils/authUtils";
import ForbiddenPage from "../components/ForbiddenPage.jsx";
import NotFoundPage from "../components/NotFoundPage.jsx";


const IndexRedirect = () => {
    const { user } = useAuth();
    const role = user?.roles?.[0]?.name;

    let path = '/login';
    if (role === 'client') path = '/client/dashboard';
    else if (role === 'super_admin') path = '/admin/dashboard';
    else if (role === 'product_manager') path = '/games';
    else if (role === 'user_manager') path = '/user/dashboard';

    console.log(`Index route redirecting based on role "${role}" to: ${path}`);
    return <Navigate to={path} replace />;
};

const ClientDashboard = () => <div>Client Dashboard (Requires: client)</div>;
const GamesPage = () => <div>Games Page (Requires: product_manager, super_admin)</div>;
const StorePage = () => <div>Store Page (Requires: client, product_manager, super_admin)</div>;
const ContactPage = () => <div>Contact Page (Public within Layout)</div>;
const AdminDashboard = () => <div>Admin Dashboard (Requires: super_admin)</div>;
const UserDashboard = () => <div>User Manager Dashboard (Requires: user_manager)</div>;

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ]
    },
    {
        path: "/forbidden",
        element: <ForbiddenPage />,
    },
    {
        path: "/",
        element: <Master />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute allowedRoles={['client', 'super_admin', 'product_manager', 'user_manager']}>
                        <IndexRedirect />
                    </ProtectedRoute>
                ),
            },
            {
                element: <ProtectedRoute allowedRoles={['client']} />,
                children: [
                    {
                        path: "client/dashboard",
                        element: <ClientDashboard />,
                    },

                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['product_manager', 'super_admin']} />,
                children: [
                    {
                        path: "games",
                        element: <GamesPage />,
                    },

                ]
            },

            {
                element: <ProtectedRoute allowedRoles={['client', 'product_manager', 'super_admin']} />,
                children: [
                    {
                        path: "store",
                        element: <StorePage />,
                    },
                    {
                        path: "contact",
                        element: <ContactPage />,
                    },
                ]
            },

            {
                element: <ProtectedRoute allowedRoles={['super_admin']} />,
                children: [
                    {
                        path: "admin/dashboard",
                        element: <AdminDashboard />,
                    },

                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['user_manager']} />,
                children: [
                    {
                        path: "user/dashboard",
                        element: <UserDashboard />,
                    },
                ]
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);