import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import './Login.css'

const Login = () => {



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

  const { setUser } = useUserContext();


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
            const { data } = await axios.post('http://localhost:8000/login', {
                email: email,
                password: password
            });

            if (data?.success === true) {
                localStorage.setItem("token", data.token)
                setUser(data.user)
                navigate("/");

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
                <h2 className='login h2'>Login</h2>
                <div className='login form'>
                    <form onSubmit={handleSubmit}>
                        <div className="login form-group">
                            <label style={{fontSize: "25px"}}>Email:</label>
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="login form-group">
                            <label style={{fontSize: "25px"}}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className='login btn '>
                            <button type="submit" className='button-30'>Login</button>
                        </div>
                        
                </form>
                </div>

                
                <div className="signup-link">
                    Don't have an account? <Link to="/sign-up" className='signup'>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login