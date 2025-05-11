import React from 'react';
import './FlatsDetailsPage.scss';
const FlatsDetailsPage = ({flat, onClose}) => {
  console.log("Flat Details:", flat);
  return (
    <div className="full-modal">
      <div className="modal-content">
      <button onClick={onClose}>Close</button>
      <h1>Flat ID: {flat.name}</h1>
        <p>Area: {flat.area}</p>
        <p>BHK: {flat.bhk}</p>
        <p>Floor: {flat.floor}</p>
        {/* Add more flat details here as needed */}
      </div>
    </div>
  );
};

export default FlatsDetailsPage;
