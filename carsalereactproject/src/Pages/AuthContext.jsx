import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
       // const token = localStorage.getItem('token'); // Assuming 'token' is your auth key
        setIsAuthenticated(true); // Set isAuthenticated based on token presence
    }, []);

    return isAuthenticated;
};

export default useAuth;