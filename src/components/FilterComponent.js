import React, { useState } from "react";
import "./FilterComponent.scss"; // Import your styles here
const FilterComponent = ({
  selectedBHKs,
  setSelectedBHKs,
  areaRange,
  setAreaRange,
  floorRange,
  setFloorRange,
  onClose
}) => {
  const toggleBHK = (bhk) => {
    if (selectedBHKs.includes(bhk)) {
      setSelectedBHKs(selectedBHKs.filter((b) => b !== bhk));
    } else {
      setSelectedBHKs([...selectedBHKs, bhk]);
    }
  };

  const [openPopup, setOpenPopup] = useState(null); // 'bhk', 'area', 'floor'

  return (
    <div className="filter-wrapper">
      <div className="filter-buttons">
        <button
          className="primary-btn"
          onClick={() => setOpenPopup(openPopup === "bhk" ? null : "bhk")}
        >
          Select BHK
        </button>
        <button
          className="primary-btn"
          onClick={() => setOpenPopup(openPopup === "area" ? null : "area")}
        >
          Area Range
        </button>
        <button
          className="primary-btn"
          onClick={() => setOpenPopup(openPopup === "floor" ? null : "floor")}
        >
          Floor Range
        </button>
        <button
            className="primary-btn" >
                All Flats List
            </button>
        <button
            className="primary-btn"
            onClick={() => {
                setSelectedBHKs([]);
                setAreaRange([300, 1800]);
                setFloorRange([1, 6]);
                setOpenPopup(null);
            }}
        >
            Reset Filters
        </button>

      </div>
        
      {openPopup === "bhk" && (
        <div className="popup">
          <h3 className="main-font">Select BHK</h3>
          <div className="checkbox-group para-font">
            {[1, 2, 3, 4].map((bhk) => (
              <label key={bhk}>
                <input
                  type="checkbox"
                  value={bhk}
                  checked={selectedBHKs.includes(bhk)}
                  onChange={() => toggleBHK(bhk)}
                />
                {bhk} BHK
              </label>
            ))}
          </div>
          <div className="close-btn">
            <button
                className="primary-btn"
                onClick={() => setOpenPopup(null)}
            >
                Close
            </button>
            </div>
        </div>
      )}

      {openPopup === "area" && (
        <div className="popup">
          <h3 className="main-font">Area Range (sq.ft)</h3>
          <input
            type="range"
            min="300"
            max="1800"
            value={areaRange[1]}
            onChange={(e) => setAreaRange([300, parseInt(e.target.value)])}
          />
          <p className="para-font">300 - {areaRange[1]} sq.ft</p>
          <div className="close-btn">
            <button
                className="primary-btn"
                onClick={() => setOpenPopup(null)}
            >
                Close
            </button>
            </div>
        </div>
        
      )}

      {openPopup === "floor" && (
        <div className="popup">
          <h3 className="main-font">Floor Range</h3>
          <input
            type="range"
            min="1"
            max="6"
            value={floorRange[1]}
            onChange={(e) => setFloorRange([1, parseInt(e.target.value)])}
          />
          <p className="para-font">1 - {floorRange[1]}</p>
          <div className="close-btn">
            <button
                className="primary-btn"
                onClick={() => setOpenPopup(null)}
            >
                Close
            </button>
            </div>
        </div>
      )}
      <div className="close-filter-component">
        <button
            className="primary-btn"
            onClick={onClose}   
        >
            Close filter
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
