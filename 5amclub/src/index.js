import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter as Router, Link, Route, Routes, Switch } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";


const root = ReactDOM.createRoot(document.getElementById('root'));
const auth = localStorage.getItem('auth')
root.render(
  <Router>
    {!!auth ?
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes> :
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>}
  </Router>

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
