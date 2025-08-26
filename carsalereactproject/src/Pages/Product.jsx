import { useState, useEffect, useRef } from 'react'

import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
//import reactLogo from './react.svg';
import viteLogo from '/vite.svg';
import logo from '/logo.png';
import './Product.css';
//import '../App.css'
//import Navigation from './Navigation.jsx'

const Product = () => {
    const {
        register,

    } = useForm();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const { id } = useParams();
    const url = 'https://jsonplaceholder.typicode.com/users/' + parseInt(id);

    useEffect(() => {
        const fetchUsers = async () => {

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);

            }

        };
        fetchUsers();


    }, []);
    const [file, setFile] = useState();
    const [imagefile, setImagefile] = useState();
    // const [binaryData, setBinaryData] = useState(null);
    const handleChangeImage = (e) => {
        e.preventDefault();
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setImagefile(e.target.files[0]);
    };


    const handleSubmit = async (data) => {
        data.preventDefault()
        const formData = new FormData(data.currentTarget);
        const id = formData.get('id');
        const name = formData.get('name');
        const image = formData.get('image');
        const price = formData.get('price');

        const imagenew = formData.get('imagenew');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        const plainObject = Object.fromEntries(formData.entries());
        const jsonString = JSON.stringify(plainObject);
        try {
            const response = await fetch('http://localhost:7124/api/setCarDetail', {
                method: 'POST',
                body: formData,
                contentType: false,
                processData: false,

            });

            if (response.ok) {
                console.log('Upload successful!');
                // setUploadStatus('Upload successful!');
                // You might want to handle the server response, e.g., get the image URL
            } else {
                console.log('Upload failed!');
                // setUploadStatus('Upload failed.');
            }
        }
        catch (error) {
            console.error('Error uploading image:', error);
            // setUploadStatus('Error during upload.');
        }
        //  navigate("/product/" + id);
    };



    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [gender, setGender] = useState("male");
    const [subjects, setSubjects] = useState({
        english: true,
        maths: false,
        physics: false,
    });
    const [resume, setResume] = useState("");
    const [url1, setUrl1] = useState();
    const [selectedOption, setSelectedOption] =
        useState("");
    const [about, setAbout] = useState("");



    const handleSubjectChange = (sub) => {
        setSubjects((prev) => ({
            ...prev,
            [sub]: !prev[sub],
        }));
    };
    const handleReset = () => {
        // Reset all state variables here
        setFirstName("");
        setLastName("");
        setEmail("");
        setContact("");
        setGender("male");
        setSubjects({
            english: true,
            maths: false,
            physics: false,
        });
        setResume("");
        setUrl1("");
        setSelectedOption("");
        setAbout("");
    };



    return (
        <>



            <form onSubmit={handleSubmit}>
                <div className="product container">
                    <div className="categoryitem">
                        <h1>Details for Product {id}</h1>
                    </div>
                    <div className="categoryitem">                         
                            First Name*                        
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            value={users.name}
                            onChange={(e) =>
                                setFirstName(e.target.value)
                            }
                            placeholder="Enter First Name"
                            required
                        />
                         Last Name* 
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            value={lastName}
                            onChange={(e) =>
                                setLastName(e.target.value)
                            }
                            placeholder="Enter Last Name"
                            required
                        />
                    </div>
                    <div className="categoryitem">
                         Enter Email* 
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter email"
                            required
                        />
                         Contact* 
                        <input
                            type="tel"
                            name="contact"
                            id="contact"
                            value={contact}
                            onChange={(e) =>
                                setContact(e.target.value)
                            }
                            placeholder="Enter Mobile number"
                            required
                        />
                    </div>
                    <div className="categoryitem">
                         Gender* 
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            id="male"
                            checked={gender === "male"}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        />
                        Male
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            id="female"
                            checked={gender === "female"}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        />
                        Female
                        <input
                            type="radio"
                            name="gender"
                            value="other"
                            id="other"
                            checked={gender === "other"}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        />
                        Other
                    </div>
                    <div className="categoryitem">
                         
                            Your best Subject
                         
                        <input
                            type="checkbox"
                            name="language"
                            id="english"
                            checked={subjects.english === true}
                            onChange={(e) =>
                                handleSubjectChange("english")
                            }
                        />
                        English
                        <input
                            type="checkbox"
                            name="language"
                            id="maths"
                            checked={subjects.maths === true}
                            onChange={(e) =>
                                handleSubjectChange("maths")
                            }
                        />
                        Maths
                        <input
                            type="checkbox"
                            name="language"
                            id="physics"
                            checked={subjects.physics === true}
                            onChange={(e) =>
                                handleSubjectChange("physics")
                            }
                        />
                        Physics
                    </div>
                    <div className="categoryitem">
                    <div>
                         Upload New Image* 
                        <input
                            type="file"
                            name="imagefile"
                            id="imagefile"
                            onChange={handleChangeImage}
                            placeholder="Enter Upload File"
                            required
                        />
                        <img src={file} />
                    </div>
                    <div>
                         Existing Image* 
                        <img src={"https://yavuzceliker.github.io/sample-images/image-" + users.id + "0.jpg"} />
                    </div>
                    </div>

                    <div className="categoryitem">
                         Enter URL*
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={(e) =>
                                setUrl1(e.target.value)
                            }
                            placeholder="Enter url"
                            required
                        />
                         Select your choice 
                        <select
                            name="select"
                            id="select"
                            value={selectedOption}
                            onChange={(e) =>
                                setSelectedOption(
                                    e.target.value
                                )
                            }
                        >
                            <option
                                value=""
                                disabled
                                selected={selectedOption === ""}
                            >
                                Select your Ans
                            </option>
                            <optgroup label="Beginers">
                                <option value="1">HTML</option>
                                <option value="2">CSS</option>
                                <option value="3">
                                    JavaScript
                                </option>
                            </optgroup>
                            <optgroup label="Advance">
                                <option value="4">React</option>
                                <option value="5">Node</option>
                                <option value="6">
                                    Express
                                </option>
                                <option value="t">
                                    MongoDB
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="categoryitem">
                         About 
                        <textarea
                            name="about"
                            id="about"
                            cols="90"
                            rows="10"
                            onChange={(e) =>
                                setAbout(e.target.value)
                            }
                            placeholder="About your self"
                            required ></textarea>
                    </div>
                    <div className="categoryitem">
                        <input type="submit" className="btn" />
                    </div>
                </div>
            </form>


        </>
    )
}

export default Product

