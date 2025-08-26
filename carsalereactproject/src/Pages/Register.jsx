import { useState } from 'react'
import { useForm } from "react-hook-form";
import "./Register.css";

function Register() {
    const {
        register,
         
        formState: { errors },
    } = useForm();
    const [registermessage, setregistermessage] = useState('');
    const handleSubmit = async (data) => {
        data.preventDefault()
        const formData = new FormData(data.currentTarget);
        try {
            const response = await fetch('http://localhost:7124/api/registeruser', {
                method: 'POST',
                body: formData,
                contentType: false,     
                processData: false,

            });

            if (response.ok) {
                console.log('Registration successful!'); 
                setregistermessage("Registration successful!");
            } else {
                console.log('Registration failed!'); 
                setregistermessage("Registration failed!");
            }
        }
        catch (error) {
            console.error('Error Registration:', error);  
            setregistermessage("Registration failed!:" +error);
        }
    };

    return (
        <>

            <div className="register">
                <div className="registeritem">
                    <h2>Registration Form</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="registeritem">
                        <p>
                            {registermessage}
                        </p>
                    </div>
                    <div className="registeritem">
                        <label> Enter Name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Name"
                        />
                        {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}
                    </div>
                    <div className="registeritem">
                        <label> Enter Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Email"
                        />
                        {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}
                    </div>
                    <div className="registeritem">
                        <label> Enter Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            placeholder="Password"
                        />
                        {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}
                    </div>
                    <div className="registeritem">
                        <input type="submit" className="btn" />
                    </div>
                </form>
            </div>
        </>
    );
}

export default Register;