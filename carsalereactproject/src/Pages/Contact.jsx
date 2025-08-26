import React from "react";
import "./Contact.css";
import image1 from "../../src/assets/2.jpg";
import image2 from "../../src/assets/3.jpg";
import image3 from "../../src/assets/5.jpg";

const Contact = () => {
    return (
        <div className="Contact container">
            
            <div className="ContactItem">
                <img src={image1} alt=""></img>
            </div>
           
            <div className="ContactItem"> 
                <h2>Contact Us  </h2>
                <p>
                    You can find us here:
                </p>
                 
                <ul>
                    <li>Contact@contact.com</li>
                    <li>+91 1234567890</li>
                    <li> Hyderabad, India</li>
                </ul>
            </div>
            
        </div>
    );
};

export default Contact;