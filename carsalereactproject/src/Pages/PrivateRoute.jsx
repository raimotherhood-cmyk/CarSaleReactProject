import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
   // const isAuthenticated = false;  

    return props.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;