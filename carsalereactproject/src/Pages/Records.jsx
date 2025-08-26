import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet, Navigate } from "react-router-dom";
import './ProductList.css';
function Records({ data }) {
    const [selectedRowId, setSelectedRowId] = useState(null);
    const navigate = useNavigate();
    const handleRowClick = (rowId) => {
        setSelectedRowId(rowId); // For single selection
        // For multi-selection, you'd toggle the ID in the array
        // setSelectedRowIds(prevIds =>
        //     prevIds.includes(rowId) ? prevIds.filter(id => id !== rowId) : [...prevIds, rowId]
        // );

        const url = "/product/" + rowId;
        navigate(url);

    };

    return (
         
            
            <tbody>
                {data.map(user => (

                    <div className="productlist" key={user.id} onClick={() => handleRowClick(user.id)}     >
                        <div className="productlistimage">
                            <img src={"https://yavuzceliker.github.io/sample-images/image-" + user.id + "0.jpg"} alt="" />
                        </div>
                        <div className="productlisttext">
                            <div>{user.id}</div>
                            <div>{user.name}</div>
                            <div>{user.price}</div>
                        </div>
                    </div>
                ))}
            </tbody>
        
    )
}

export default Records  