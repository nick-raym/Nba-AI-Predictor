import './App.css';
import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';




function App() {

  
  return (
      <>
      <div className="app">
        <Navbar  />
        <Outlet />
      </div>
      </>
  );
}

export default App;
