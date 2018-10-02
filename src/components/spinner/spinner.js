import React from 'react';
import spinner from '../../assets/loading_icon.gif';
import './spinner.scss';

const LoadingSpinner = () => (
  <div>
    <img className='loading-gif' src={spinner} width='40' alt='Loading icon' /> Submitting...
  </div>
);

export default LoadingSpinner;
