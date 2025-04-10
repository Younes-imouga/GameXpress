import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';


export const getStoredPermissions = () => {
    const permissions = localStorage.getItem('permissions');
    try {

        return permissions ? JSON.parse(permissions) : [];
    } catch (e) {
        console.error("Error parsing permissions from localStorage", e);
        localStorage.removeItem('permissions');
        return [];
    }
};


const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            localStorage.removeItem('user');
            return null;
        }
    }
    return null;
};



export const useAuth = () => {

    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(getStoredUser);
    const [permissions, setPermissions] = useState(getStoredPermissions);
    const [loading, setLoading] = useState(false);


    const syncStateFromStorage = useCallback(() => {
        console.log("Syncing auth state from storage...");
        setToken(localStorage.getItem('token'));
        setUser(getStoredUser());
        setPermissions(getStoredPermissions());
    }, []);


    useEffect(() => {
        const handleStorageChange = (event) => {

            if (event.key === 'token' || event.key === 'user' || event.key === 'permissions') {
                syncStateFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);


        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [syncStateFromStorage]);



    const hasPermission = useCallback((requiredPermission) => {
        if (!requiredPermission) return true;
        if (!Array.isArray(permissions)) return false;
        return permissions.includes(requiredPermission);
    }, [permissions]);




    const hasRole = useCallback((requiredRoleOrRoles) => {
        if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
            return false;
        }
        const userRole = user.roles[0].name;
        if (!userRole) return false;

        const requiredRoles = Array.isArray(requiredRoleOrRoles) ? requiredRoleOrRoles : [requiredRoleOrRoles];

        return requiredRoles.includes(userRole);

    }, [user]);



    const logout = useCallback(async () => {
        console.log("Logging out...");
        setLoading(true);
        const currentToken = localStorage.getItem('token');


        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('permissions');
        setToken(null);
        setUser(null);
        setPermissions([]);







        await new Promise(resolve => setTimeout(resolve, 500));




        console.log("Redirecting to /login after delay");
        window.location.replace('/login');

    }, [axiosInstance]);


    return {
        token,
        user,
        permissions,
        loading,
        isLoggedIn: !!token,
        hasPermission,
        hasRole,
        logout,
    };
}; 