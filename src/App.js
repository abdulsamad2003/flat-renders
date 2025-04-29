import './App.scss';
import React from 'react';
import Flats from './components/Flats';
import { BrowserRouter,  Route, Router, Routes } from 'react-router-dom';
import FlatsDetailsPage from './components/FlatsDetailsPage';
function App() {
  return (
    <BrowserRouter>   
        <Routes>
          <Route path="/" element={<Flats />} />
          <Route path="/flat/:flatsId" element={<FlatsDetailsPage />} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
