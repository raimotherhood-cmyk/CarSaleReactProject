import { useState } from 'react'
import { useForm } from "react-hook-form";
import "./Login.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

const Login = ({ login }) => {
    const {
        register,

        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [errormessage, seterrormessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSubmit = async (data) => {
        data.preventDefault();
        const formData = new FormData(data.currentTarget);
        const userid = formData.get('userid');
        try {
            const userData = await fetch('http://localhost:7124/api/authenticate', {
                method: 'POST',
                body: formData,
                contentType: false,
                processData: false,

            });

            if (userData.ok) {
                console.log(userid + " You Are Successfully Logged In");

                login(userid);
                navigate("/productlist");

            }
            else {
                console.log("Email or Password is not matching with our record");
                seterrormessage("Email or Password is not matching with our record");
            }
        }
        catch (error) {
            console.error('Error login:', error);
            seterrormessage("Login failed!:" + error);
        }
    };

    return (
        <>
            <div className="login">
                <div className="loginitem">
                    <h2>Login Form</h2>
                </div>


                <form onSubmit={handleSubmit}>
                    <div className="loginitem">
                        <p>
                            {errormessage}
                        </p>
                    </div>

                    <div className="loginitem">
                        <label> Enter User ID</label>
                        <input
                            type="email"
                            {...register("userid", { required: true })}
                            placeholder="Email"
                        />
                        {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}
                    </div>
                    <div className="loginitem">
                        <label> Enter Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            placeholder="Password"
                        />
                        {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}
                    </div>
                    <div className="loginitem">
                        <input type="submit" className="btn" />
                    </div>
                    <div className="loginitem">
                        <h3>Create an account?<Link to="/register" ><a>Register</a></Link> </h3>
                    </div>
                </form>
            </div >
        </>
    );
}

export default Login;