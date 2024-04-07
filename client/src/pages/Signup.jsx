import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css"

const Signup = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();




    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(email, password);
            const { data } = await axios.post('http://localhost:8000/register', {
                email: email,
                password: password
            });

            if (data?.success === true) {
                // localStorage.setItem("token", data.token)
                // setUser(data.user)
                // window.location.reload();
                alert("register success")
                navigate("/login");

            } else {
                alert("Something went wrong")
            }

            // Handle successful login, e.g., redirect to dashboard
            console.log(data);
        } catch (error) {
            // Handle login error, e.g., display error message
            console.error(error);
        }

    };

    return (
        <div className='login main'>
            <div className="login cont">
                <h2 className='login h2'>Signup</h2>
                <div className='login form'>
                    <form onSubmit={handleSubmit}>
                        <div className="login form-group">
                            <label style={{ fontSize: "25px" }}>Email:</label>
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="login form-group">
                            <label style={{ fontSize: "25px" }}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className='login btn '>
                            <button type="submit" className='button-30'>Signup</button>
                        </div>

                    </form>
                </div>


                <div className="signup-link">
                    Already have an account? <Link to="/login" className='signup'>Log in</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup

