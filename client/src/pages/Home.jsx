import React, { useEffect, useState } from 'react'
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom"
import './Home.css'
import axios from 'axios';

const Home = () => {
    const { user } = useUserContext();
    // console.log(user);
    // name, pricing, alias
    const [name, setName] = useState("");
    const [pricing, setPricing] = useState("");
    const [alias, setAlias] = useState("");
    const [finalData, setFinalData] = useState([]);
    const [currPri, setCurrPri] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handlePricingChange = (event) => {
        setPricing(event.target.value);
    };
    const handleAliasChange = (event) => {
        setAlias(event.target.value);
    };

    const handleLogoutClick = () => {
        localStorage.clear();
        navigate("/login")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            console.log(name, alias, pricing);
            const { data } = await axios.post('http://localhost:8000/', {
                name,
                pricing,
                alias
            }, config);
            // Handle successful login, e.g., redirect to dashboard
            console.log(data);
            fetchTable();
        } catch (error) {
            // Handle login error, e.g., display error message
            console.error(error);
        }
    };
    const [urlData, setUrlData] = useState({});
    const fetchTable = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            // const { data } = await axios.get('http://localhost:8000/', config);
            console.log(user?.email);
            setLoading(true);
            const { data } = await axios.get('http://localhost:8000/', {
                params: {
                    email: user?.email
                },
                ...config,
            });
            setLoading(false);

            console.log(data.currpriceArr, "this is data");
            setCurrPri(data.currpriceArr);
            setUrlData(data.list)

            // console.log(urlData);
        } catch (error) {
            console.error(error);
        }
    };
    const deleteItem = async (e, _id) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const { data } = await axios.post('http://localhost:8000/delete', { _id }, config);
            fetchTable();


        }
        catch (error) {
            console.log(error)
        }


    }

    useEffect(() => {
        fetchTable();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render
    useEffect(() => {
        console.log(urlData);
    }, [urlData]);

    return (
        <div>
            <div className="div1">
                <h1>Buy as per your budget</h1>
                <p>{user?.email}</p>
                <button onClick={handleLogoutClick}>Logout</button>
            </div>

            <div className="div3">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="link" onChange={handleNameChange} placeholder="Enter a new link" required />
                    <input type="text" name="price" onChange={handlePricingChange} placeholder="Enter the price" required />
                    <input type="text" name="alias" onChange={handleAliasChange} placeholder="Enter Alias for the link" />
                    <button type="submit" name="button" className="btn">Add</button>
                </form>
            </div>

            {loading ? (
                <h2 className="loader">Scrapping data this may take some time....</h2>
            ):(



            <div className="div2">
                <form className="">


                    <table>
                        <thead>
                            <tr>
                                <th>Alias</th>
                                <th>Budget</th>
                                <th>Current Price</th>
                                <th>Link To Product</th>
                                <th>Delete item</th>
                            </tr>
                        </thead>

                        <tbody>

                            {urlData.length > 0 && urlData.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.name}</td> */}
                                    <td>{item.alias}</td>
                                    <td>{item.pricing}</td>
                                    <td>{currPri[index]}</td>
                                    <td><a href={item.name}>link</a></td>
                                    <td>
                                        <button type="submit" value={index} onClick={(e) => { deleteItem(e, item?._id) }} name="btn">X</button>
                                    </td>
                                </tr>
                            ))}



                        </tbody>

                    </table>
                </form>

            </div>


            )}
        </div >

    )
}

export default Home
