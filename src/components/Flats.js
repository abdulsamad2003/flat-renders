import React, { useEffect, useState } from 'react'
import renderImage from '../assests/render-1.jpg';
import './Flats.scss';  
import { supabase } from '../lib/supabaseClient';
import FlatsDetailsPage from './FlatsDetailsPage';
const Flats = () => {
  const [flats, setFlats] = useState([])
  const [selectedFlats, setSelectedFlats] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [fullFlatData, setFullFlatData] = useState(null);

  useEffect(() => {
    const fetchFlats = async () => {
      const { data, error } = await supabase.from('flats').select('*');
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        console.log("Fetched Flats Data:", data);
        setFlats(data);
      }
    };

    fetchFlats();
  }, []);

// when url changes or page loads
  useEffect(() => {
  const checkUrl = () => {
    const path = window.location.pathname;

    if(path.startsWith('/flat/')){
      const flatId = path.split('/flat/')[1].toUpperCase();
      const flat = flats.find(f => f.name === flatId);
      if(flat){
        setSelectedFlats(flat);
      }
    }
  };
  window.addEventListener('popstate', checkUrl);
  checkUrl(); // Check on initial load
  return () => {
    window.removeEventListener('popstate', checkUrl);
  };

},[flats])

const openFullPopup = (flat) => {
  setFullFlatData(flat);
  window.history.pushState({}, '', `/flat/${flat.name.toLowerCase()}`);
};

const closeFullPopup = () => {
  setFullFlatData(null);
  window.history.pushState({}, '', '/');
};

const handlePathClick = (e, id) => {
    console.log("Clicked id:", id);
    console.log("Available flats:", flats);
    const flat = flats.find(f => f.name === id); 
    setSelectedFlats(flat);
    console.log("Selected Flat:", flat);


    const rect = e.target.getBoundingClientRect()    ;
    setPopupPosition({
      x: rect.left + rect.width / 2 + window.scrollX,  // Add horizontal scroll
      y: rect.top + rect.height / 2 + window.scrollY,   // Add vertical scroll
    });
  };

  return (  
   <>
  <section className="wrapper">
    <img alt='Bg image' src={renderImage} width="100%" height="auto" />
    <svg width="5000" height="3750" viewBox="0 0 5000 3750" fill="none" xmlns="http://www.w3.org/2000/svg">   
      <path id='A04' onClick={(e) => handlePathClick(e, 'A04')} d="M4586 2397L4505 2401L4463 2398L4333 2404V2272L4467 2267L4508 2269L4585 2266L4586 2397Z" fill="black" />
      <path id='A03' onClick={(e) => handlePathClick(e, 'A03')} d="M4333 2272V2404L4239 2408L4238 2415L4154 2418L4102 2412L4101 2278L4153 2280L4333 2272Z" fill="black" />
      <path id='A02' onClick={(e) => handlePathClick(e, 'A02')} d="M4103 2412L3852 2425V2288L4102 2278L4103 2412Z" fill="black" />
      <path id='A01' onClick={(e) => handlePathClick(e, 'A01')} d="M3852 2423L3589 2435L3588 2298L3852 2288V2423Z" fill="black" />
      
      <path id='B04' onClick={(e) => handlePathClick(e, 'B04')} d="M4333 2272L4465 2267L4507 2270L4585 2266L4584 2136L4509 2138L4466 2136L4333 2140V2272Z" fill="black" />
      <path id='B03' onClick={(e) => handlePathClick(e, 'B03')} d="M4333 2140V2272L4154 2280L4101 2278V2144L4154 2148L4333 2140Z" fill="black" />
      <path id='B02' onClick={(e) => handlePathClick(e, 'B02')} d="M4101 2278L3852 2288V2151L4101 2144V2278Z" fill="black" />
      <path id='B01' onClick={(e) => handlePathClick(e, 'B01')} d="M3853 2151L3852 2288L3588 2298L3587 2158L3853 2151Z" fill="black" />
      
      <path id='C04' onClick={(e) => handlePathClick(e, 'C04')} d="M4333 2140L4466 2136L4508 2138L4584 2136L4583 2011L4508 2012L4462 2011L4333 2013V2140Z" fill="black" />
      <path id='C03' onClick={(e) => handlePathClick(e, 'C03')} d="M4333 2013V2140L4154 2148L4101 2144V2015L4155 2016L4333 2013Z" fill="black" />
      <path id='C02' onClick={(e) => handlePathClick(e, 'C02')} d="M4101 2014V2144L3852 2151L3851 2017L4101 2014Z" fill="black" />
      <path id='C01' onClick={(e) => handlePathClick(e, 'C01')} d="M3851 2017L3852 2150L3587 2158L3585 2020L3851 2017Z" fill="black" />

      <path id='D04' onClick={(e) => handlePathClick(e, 'D04')} d="M4583 2011L4508 2012L4467 2011L4333 2013L4332 1883L4583 1882V2011Z" fill="black" />
      <path id='D03' onClick={(e) => handlePathClick(e, 'D03')} d="M4333 2013L4152 2016L4101 2015L4100 1884L4332 1883L4333 2013Z" fill="black" />
      <path id='D02' onClick={(e) => handlePathClick(e, 'D02')} d="M4101 2014L3851 2017V1886L4100 1884L4101 2014Z" fill="black" />
      <path id='D01' onClick={(e) => handlePathClick(e, 'D01')} d="M3851 2017L3585 2020L3584 1888L3851 1886V2017Z" fill="black" />

      <path id='E04' onClick={(e) => handlePathClick(e,'E04')} d="M4332 1883L4583 1882V1743L4331 1739L4332 1883Z" fill="black" />
      <path id='E03' onClick={(e) => handlePathClick(e,'E03')} d="M4331 1739L4332 1883L4100 1884L4099 1736L4331 1739Z" fill="black" />
      <path id='E02' onClick={(e) => handlePathClick(e,'E02')} d="M4099 1736L4100 1884L3851 1886L3850 1732L4099 1736Z" fill="black" />
      <path id='E01' onClick={(e) => handlePathClick(e,'E01')} d="M3851 1886L3585 1888L3586 1728L3850 1732L3851 1886Z" fill="black" />

      <path id='F02' onClick={(e) => handlePathClick(e,'F02')} d="M4021 1557L4022 1735L4583 1743L4582 1699L4517 1697L4515 1569L4021 1557Z" fill="black" />
      <path id='F01' onClick={(e) => handlePathClick(e,'F01')} d="M4021 1557L4022 1734L3520 1727L3519 1543L4021 1557Z" fill="black" />
    </svg>
  {selectedFlats && (
    <div className="flat-details"
     style={{
      position: 'absolute',
      top: popupPosition.y,
      left: popupPosition.x,
      transform: 'translate(-50%, 10%)', /* center it nicely above */
      zIndex: 999
    }}>
      <span>
        <h2>Flat No.</h2>
        <p>{selectedFlats.name}</p>
      </span>
      <span>
        <h2>Area</h2>
        <p>{selectedFlats.area}</p>
      </span>
      <span>
        <h2>BHK</h2>
        <p>{selectedFlats.bhk}</p>
      </span>
      <span>
        <h2>Floor</h2>
        <p>{selectedFlats.floor}</p>
      </span>
      {selectedFlats && (
      <button onClick={() => openFullPopup(selectedFlats)}>Get Full Details: {selectedFlats.name}</button>
    )}
    <button onClick={() => setSelectedFlats(null)}>Close</button>

  
   {/* Full Big Popup (Separate Component) */}
      {fullFlatData && (
        <FlatsDetailsPage flat={fullFlatData} onClose={closeFullPopup} />
      )}

    </div>
  )}
  </section>
    </>
  )
}

export default Flats
