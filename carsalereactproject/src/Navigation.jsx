import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
//import { useLocation } from 'react-router'
import './index.css'
import './Navigation.css'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import ProductList from './Pages/ProductList'
//import Layout from './Layout.jsx'
import PrivateRoute from './Pages/PrivateRoute.jsx';
import logo from '../src/assets/11.jpg';
import menuicon from '../src/assets/menuicon.jpg';
import { useIdleTimer } from 'react-idle-timer';
import LocationTracker from './LocationTracker.jsx';
function Navigation() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {

        const fetchedMenuItems = [
            { id: 1, label: 'Home', path: '/' },
            { id: 2, label: 'About', path: '/about' },
            { id: 3, label: 'Contact', path: '/contact' },
            //{ id: 4, label: 'Register', path: '/register', isAuthenticated: false },
            { id: 5, label: 'Login', path: '/login', isAuthenticated: false },
            { id: 6, label: 'ProductList', path: '/productlist', isAuthenticated: true },

        ];
        if (isAuthenticated) {
            const filteredItems = fetchedMenuItems.filter(item => item.isAuthenticated !== false);
            setMenuItems(filteredItems);
        }
        if (!isAuthenticated) {
            const filteredItems = fetchedMenuItems.filter(item => item.isAuthenticated !== true);
            setMenuItems(filteredItems);
        }

    }, [user, isAuthenticated]);

    // let  location = useLocation().state;



    const login = (user) => {

        setIsAuthenticated(true);
        setUser(user);
    };
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleLogout = () => {
        logout();

        // navigate('/home');
    };

    ////////
    const onIdle = () => {
        console.log('User is idle');
        logout();
    };

    const onActive = () => {
        console.log('User is active');
    };


    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 1, // 5 minutes of inactivity
        onIdle: onIdle,
        onActive: onActive,

        debounce: 500, // Debounce onAction by 500ms
    });
    const [remainingTime, setRemainingTime] = useState(getRemainingTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(getRemainingTime());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [getRemainingTime]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const [mobilemenu, setMobilemenu] = useState(false);
    const toggleMenu = () => {
        mobilemenu ? setMobilemenu(false) : setMobilemenu(true);

    }
    return (
        <>

            <div>

                <nav className="container  dark-nav">

                    <img src={logo} alt="" className="logoclass" ></img>
                    <h3>Your geo location:<LocationTracker /></h3>

                    {user && <h3>Welcome {user} !
                        <button className="btn" onClick={handleLogout}>
                            Logout {formatTime(remainingTime)}
                        </button> </h3>}


                    <ul className={mobilemenu ? '' : 'hide-mobile-menu'}>
                        {menuItems.map(item => (
                            <li key={item.id}>
                                <Link to={item.path}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                    <img src={menuicon} alt="" className="menu-icon" onClick={toggleMenu}></img>
                </nav>



                <Routes>

                    <Route path="/" element="" />
                    <Route path="/about" element="" />
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/productlist" element={<ProductList logout={logout} />} />
                        <Route path="/product/:id" element={<Product logout={logout} />} />
                    </Route>

                    <Route path="/contact" element="" />
                    <Route path="/login" element={<Login login={login} />} />
                    <Route path="/register" element={<Register />} />

                </Routes>






            </div>
        </>
    );
};


export default Navigation;