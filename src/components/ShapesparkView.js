import React from 'react'
import "./ShapesparkView.scss"; // Style modal here
const ShapesparkView = ({onClose, ShapesparkView}) => {
    console.log("ShapesparkView", ShapesparkView)
  return (
    <div className="shapespark-iframe-popup">
    <div className="iframe-wrapper">
      <iframe
        src={ShapesparkView.shapespark_url}
        allow="fullscreen; vr; xr; accelerometer; gyroscope"
        allowFullScreen
        title="Shapespark 3D Model"
      ></iframe>
      <button className="close-btn" onClick={onClose}>
        ✕ Close
      </button>
    </div>
  </div>
  )
}

export default ShapesparkView