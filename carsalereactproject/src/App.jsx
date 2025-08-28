import { useState, useEffect } from 'react'
 
import { useLocation } from 'react-router-dom'
import './App.css';
import Navigation from './Navigation.jsx';
import LocationTracker from './LocationTracker.jsx';
import Home from './Pages/Home.jsx';
import About from './Pages/About';
import Contact from './Pages/Contact';
 


const App = () => {
    const [hide, setHide] = useState(null);
     
    const location = useLocation();
    useEffect(() => {
   
        if (location.pathname == "/" || location.pathname == "/about" || location.pathname == "/contact") {
            setHide(true);
        //(location.pathname + "0 " + isAuthenticated);
    }
    else {
            setHide(false);
       // alert(location.pathname + " 1" + isAuthenticated);
    }
    } );
   // alert(location.pathname + ", " + location.search + ",  " + location.key + ",   " + location.state + " . " + location.hash); 
  return (
      <>
          <div>
              
              <Navigation />
              
          </div>


    </>
  )
}

export default App

 