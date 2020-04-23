import React from 'react';
import './BackgroundImage.css';
const BackgroundImage = ({ url }) => {
  // Using div because img elements are too zoomed in
  return (
    <div
      style={{ backgroundImage: `url(${url})` }}
      alt="bg"
      className="img_bg"
    />
  );
};

export default BackgroundImage;
