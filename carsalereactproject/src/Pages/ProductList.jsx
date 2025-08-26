import { useState, useEffect } from 'react'

import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet, Navigate } from "react-router-dom";
//import reactLogo from './assets/react.svg';
//import viteLogo from '/vite.svg';
import './ProductList.css';
//import Navigation from './Navigation.jsx';
//import Login from './Pages/Login.jsx';
import Pagination from '../Pages/Pagination.jsx';
import Records from '../Pages/Records.jsx';


const ProductList = () => {

    const [users, setUsers] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(3);

    useEffect(() => {
        const fetchUsers = async () => {

            const response = await fetch('http://localhost:7124/api/getCarList');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setData(data);
                setLoading(false);
            }

        };
        fetchUsers();
    }, []);
    const navigate = useNavigate();
    const handleProduct = () => {

        navigate('/product/0');
    };


    const endIndex = currentPage * recordsPerPage;
    const indexOfFirstRecord = endIndex - recordsPerPage;
    const currentRecords = data.slice(indexOfFirstRecord, endIndex);
    const nPages = Math.ceil(data.length / recordsPerPage)


    return (
        <>

            <div className="title">
                <h2> Products availabe in your city 
                    <button className="btn" onClick={handleProduct}>
                    Create New Product
                    </button></h2>
            </div>
            <div className="productlist">
            {loading && <div><h2> Loading... </h2></div>}

            {!loading && <div>
                
                <Records data={currentRecords} />

                    <Pagination  
                    nPages={nPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>}

            </div>
        </>
    )
}

export default ProductList

