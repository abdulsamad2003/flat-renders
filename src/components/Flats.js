import React, { use, useEffect, useRef, useState } from "react";
import renderImage from "../assests/render-1.jpg";
import "./Flats.scss";
import { supabase } from "../lib/supabaseClient";
import FlatsDetailsPage from "./FlatsDetailsPage";
import ShapesparkView from "./ShapesparkView";
import { IoMdClose } from "react-icons/io";
import { Bs0Circle } from "react-icons/bs";
const Flats = () => {
  const scrollableRef = useRef(null);

  const [flats, setFlats] = useState([]);
  const [selectedFlats, setSelectedFlats] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [fullFlatData, setFullFlatData] = useState(null);
  const [shapesparkData, setShapesparkData] = useState(null);
  const fetchFlats = async () => {
    const { data, error } = await supabase.from("flats").select("*");
    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Fetched Flats Data:", data);
      setFlats(data);
    }
  };
  useEffect(() => {
    fetchFlats();
    
    const channel = supabase
      .channel("flats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "flats" },
        (payload) => {
          console.log("Change received!", payload);
          fetchFlats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, []);


  // when url changes or page loads
  useEffect(() => {
  
    const checkUrl = () => {
      const path = window.location.pathname;

      if (path.startsWith("/flat/")) {
        const flatId = path.split("/flat/")[1].toUpperCase();
        const flat = flats.find((f) => f.name === flatId);
        if (flat) {
          setSelectedFlats(flat);
        }
      }
    };
    window.addEventListener("popstate", checkUrl);
    checkUrl(); // Check on initial load
    return () => {
      window.removeEventListener("popstate", checkUrl);
    };
  }, [flats]);

  const openFullPopup = (flat) => {
    setFullFlatData(flat);
    window.history.pushState({}, "", `/flat/${flat.name.toLowerCase()}`);    
  };

  const openShapesparkView = (flat) => {
    setShapesparkData(flat);
    window.history.pushState({}, "", `/flat/${flat.shapespark_url.toLowerCase()}`);    
  };

  const closeFullPopup = () => {
    setFullFlatData(null);
    window.history.pushState({}, "", "/");
    setShapesparkData(null)
  };
// get available and unavailbe class
  const getFlatClass = (id) => {
    const flat = flats.find((f) => f.name === id);
    return flat?.available ? "green" : "red";
  };


  const handlePathClick = (e, id) => {
    fetchFlats();
    console.log("Clicked id:", id);
    console.log("Available flats:", flats);
    const flat = flats.find((f) => f.name === id);  
    setSelectedFlats(flat);
    console.log("Selected Flat:", flat);
    
    const rect = e.target.getBoundingClientRect();
    const container = scrollableRef.current;
    const containerRect = container.getBoundingClientRect();  
    setPopupPosition({
      x: rect.left - containerRect.left + container.scrollLeft + rect.width / 2,
      y: rect.top - containerRect.top + container.scrollTop + rect.height / 2,
    });
    
  };
  return (
    <>
    <artcile className="wrapper-container">
      <section className="wrapper" ref={scrollableRef}>
        <img className="bg-img" alt="Bg image" src={renderImage} />
        <svg
          width="5000"
          height="3750"
          viewBox="0 0 5000 3750"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="A04"
            onClick={(e) => handlePathClick(e, "A04")}
            d="M4586 2397L4505 2401L4463 2398L4333 2404V2272L4467 2267L4508 2269L4585 2266L4586 2397Z"
            fill="black"
            className={getFlatClass("A04")}
          />
          <path
            id="A03"
            onClick={(e) => handlePathClick(e, "A03")}
            d="M4333 2272V2404L4239 2408L4238 2415L4154 2418L4102 2412L4101 2278L4153 2280L4333 2272Z"
            fill="black"
            className={getFlatClass("A043")}

          />
          <path
            id="A02"
            onClick={(e) => handlePathClick(e, "A02")}
            d="M4103 2412L3852 2425V2288L4102 2278L4103 2412Z"
            fill="black"
            className={getFlatClass("A02")}

          />
          <path
            id="A01"
            onClick={(e) => handlePathClick(e, "A01")}
            d="M3852 2423L3589 2435L3588 2298L3852 2288V2423Z"
            fill="black"
            className={getFlatClass("A01")}

          />

          <path
            id="B04"
            onClick={(e) => handlePathClick(e, "B04")}
            d="M4333 2272L4465 2267L4507 2270L4585 2266L4584 2136L4509 2138L4466 2136L4333 2140V2272Z"
            fill="black"
            className={getFlatClass("B04")}
          />
          <path
            id="B03"
            onClick={(e) => handlePathClick(e, "B03")}
            d="M4333 2140V2272L4154 2280L4101 2278V2144L4154 2148L4333 2140Z"
            fill="black"
            className={getFlatClass("B03")}

          />
          <path
            id="B02"
            onClick={(e) => handlePathClick(e, "B02")}
            d="M4101 2278L3852 2288V2151L4101 2144V2278Z"
            fill="black"
            className={getFlatClass("B02")}
          />
          <path
            id="B01"
            onClick={(e) => handlePathClick(e, "B01")}
            d="M3853 2151L3852 2288L3588 2298L3587 2158L3853 2151Z"
            fill="black"
            className={getFlatClass("B01")}
          />

          <path
            id="C04"
            onClick={(e) => handlePathClick(e, "C04")}
            d="M4333 2140L4466 2136L4508 2138L4584 2136L4583 2011L4508 2012L4462 2011L4333 2013V2140Z"
            fill="black"
            className={getFlatClass("C04")}
          />
          <path
            id="C03"
            onClick={(e) => handlePathClick(e, "C03")}
            d="M4333 2013V2140L4154 2148L4101 2144V2015L4155 2016L4333 2013Z"
            fill="black"
            className={getFlatClass("C03")}
          />
          <path
            id="C02"
            onClick={(e) => handlePathClick(e, "C02")}
            d="M4101 2014V2144L3852 2151L3851 2017L4101 2014Z"
            fill="black"
            className={getFlatClass("C02")}
          />
          <path
            id="C01"
            onClick={(e) => handlePathClick(e, "C01")}
            d="M3851 2017L3852 2150L3587 2158L3585 2020L3851 2017Z"
            fill="black"
            className={getFlatClass("C01")}
          />

          <path
            id="D04"
            onClick={(e) => handlePathClick(e, "D04")}
            d="M4583 2011L4508 2012L4467 2011L4333 2013L4332 1883L4583 1882V2011Z"
            fill="black"
            className={getFlatClass("D04")}
          />
          <path
            id="D03"
            onClick={(e) => handlePathClick(e, "D03")}
            d="M4333 2013L4152 2016L4101 2015L4100 1884L4332 1883L4333 2013Z"
            fill="black"
            className={getFlatClass("D03")}
          />
          <path
            id="D02"
            onClick={(e) => handlePathClick(e, "D02")}
            d="M4101 2014L3851 2017V1886L4100 1884L4101 2014Z"
            fill="black"
            className={getFlatClass("D02")}
          />
          <path
            id="D01"
            onClick={(e) => handlePathClick(e, "D01")}
            d="M3851 2017L3585 2020L3584 1888L3851 1886V2017Z"
            fill="black"
            className={getFlatClass("D01")}
          />

          <path
            id="E04"
            onClick={(e) => handlePathClick(e, "E04")}
            d="M4332 1883L4583 1882V1743L4331 1739L4332 1883Z"
            fill="black"
            className={getFlatClass("E04")}
          />
          <path
            id="E03"
            onClick={(e) => handlePathClick(e, "E03")}
            d="M4331 1739L4332 1883L4100 1884L4099 1736L4331 1739Z"
            fill="black"
            className={getFlatClass("E03")}
          />
          <path
            id="E02"
            onClick={(e) => handlePathClick(e, "E02")}
            d="M4099 1736L4100 1884L3851 1886L3850 1732L4099 1736Z"
            fill="black"
            className={getFlatClass("E02")}
          />
          <path
            id="E01"
            onClick={(e) => handlePathClick(e, "E01")}
            d="M3851 1886L3585 1888L3586 1728L3850 1732L3851 1886Z"
            fill="black"
            className={getFlatClass("E01")}
          />

          <path
            id="F02"
            onClick={(e) => handlePathClick(e, "F02")}
            d="M4021 1557L4022 1735L4583 1743L4582 1699L4517 1697L4515 1569L4021 1557Z"
            fill="black"
            className={getFlatClass("F02")}
          />
          <path
            id="F01"
            onClick={(e) => handlePathClick(e, "F01")}
            d="M4021 1557L4022 1734L3520 1727L3519 1543L4021 1557Z"
            fill="black"
            className={getFlatClass("F01")}
          />
        </svg>
        {selectedFlats && (
          <section
            className="flat-details"
            style={{
              position: "absolute",
              top: popupPosition.y,
              left: popupPosition.x,
              transform: "translate(-50%, 10%)" /* center it nicely above */,
              zIndex: 999,
            }}
          >
            <div className="close-btn"
             onClick={() => setSelectedFlats(null)}>  
              {/* Close button */}
                 <IoMdClose/>
            </div>
            <div className="floor-detail-image">
              <img
                className="floor-image"
                alt="floor plain image"
                src={`${selectedFlats.floor_image_url}?t=${Date.now()}`}
              />
            </div>
            <div className="small-popup-details">
            <span>
              <h2>Flat No.</h2>
              <p>{selectedFlats.name}</p>
            </span>
            <span>
              <h2>BHK</h2>
              <p>{selectedFlats.bhk}BHK</p>
            </span>
            <span>
              <h2>Floor</h2>
              <p>{selectedFlats.floor}</p>
            </span>
              </div>
            <div className="btn">
            {selectedFlats && (
              <button
                className="main-font full-detail-btn"
                onClick={() => openFullPopup(selectedFlats)}
              >
                Get Full Details: {selectedFlats.name}
              </button>
              
            )}
            </div>
            <div className="btn">
            {selectedFlats && (
              <button
                className="main-font full-detail-btn"
                onClick={() => openShapesparkView(selectedFlats)}
              >
                View Live 3D Model
              </button>
            )}
            </div>
            

          </section>
        )}
      </section>
      </artcile>
        {/* Full Big Popup (Separate Component) */}
        {fullFlatData && (
          <FlatsDetailsPage flat={fullFlatData} onClose={closeFullPopup} />
        )}
        {shapesparkData && (
          <ShapesparkView ShapesparkView={shapesparkData} onClose={closeFullPopup} />
        )}
    </>
  );
};

export default Flats;
