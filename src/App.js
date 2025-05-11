import './App.scss';
import React from 'react';
import Flats from './components/Flats';
import { BrowserRouter,  Route, Routes } from 'react-router-dom';
import FlatsDetailsPage from './components/FlatsDetailsPage';
import AdminFlats from "./Pages/AdminFlats";
import AdminLogin from './Pages/AdminLogin';
function App() {
  return (
    <BrowserRouter>  
        <Routes>
          <Route path="/" element={<Flats />} />
          <Route path="/flat/:flatsId" element={<FlatsDetailsPage />} />
          <Route path="/admin" element={<AdminLogin />} />  {/* Admin Login page */}
          <Route path="/admin/dashboard" element={<AdminFlats />} />  </Routes>
      </BrowserRouter>
  );
}

export default App;
