import React from "react";
import "./About.css";
import image1 from "../../src/assets/4.jpg";
import image2 from "../../src/assets/12.jpg";
import image3 from "../../src/assets/10.jpg";

const About = () => {
    return (
        <div className="About container">
            <div className="AboutItem">
                <img src={image1} alt=""></img>
                <div className="caption">
                    <img src={image3} alt=""></img>
                    <p>Software solutions</p>
                </div>
            </div> 
            <div className="AboutItem">
                <img src={image2} alt=""></img>
                <div className="caption">
                    <img src={image1} alt=""></img>
                    <p>Travel solutions</p>
                </div>
            </div> 
            <div className="AboutItem">
                <img src={image3} alt=""></img>
                <div className="caption">
                    <img src={image2} alt=""></img>
                    <p>Training solutions</p>
                </div>
            </div> 
        </div>
    );
};

export default About;