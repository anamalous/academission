// src/components/common/Loader.js
import React from 'react';
import './common.css';

const Loader = ({ message = "Loading..." }) => (
  <div className="universal-loader">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

export default Loader;