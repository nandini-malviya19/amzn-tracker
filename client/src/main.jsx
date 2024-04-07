import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from './context/UserContext.jsx'


ReactDOM.render(
  
    <BrowserRouter>
      <UserProvider>

        <App />
      </UserProvider>
    </BrowserRouter>
  ,
  document.getElementById('root')
);
