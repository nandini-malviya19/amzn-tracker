import React from 'react'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {
    if(localStorage.getItem("token")){
        return React.createElement(Navigate, { to: '/' });
    }  else{
        return React.createElement(React.Fragment, null, children);
    }
 
}

export default PublicRoute