import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);


  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // console.log("yop");
        const { data } = await axios.get('http://localhost:8000/current-user', config);
        if (data?.success) {
          setLoggedIn(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  if (loading) {
    // You can show a loading indicator here while checking the login status.
    return <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)" ,
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000"
  }
}>
  <RotatingLines
    strokeColor="lightBlue"
    strokeWidth="5"
    animationDuration="0.75"
    width="96"
    visible={true}

  />
    </div >;
  }

if (loggedIn) {
  // If the user is logged in, render the protected children.
  return <React.Fragment>{children}</React.Fragment>;
} else {
  // If the user is not logged in, redirect to the login page.
  return <Navigate to="/login" />;
}
};

export default ProtectedRoute;
