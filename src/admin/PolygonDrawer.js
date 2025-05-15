import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const PolygonDrawer = () => {
  const [polygons, setPolygons] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const svgRef = useRef();

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setBackgroundImage(imageURL);
    }
  };

  const getSvgCoords = (e) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  const handleSvgClick = (e) => {
    const { x, y } = getSvgCoords(e);
    setCurrentPoints([...currentPoints, { x, y }]);
  };

  const handlePointDrag = (e, index) => {
    const { x, y } = getSvgCoords(e);
    const updated = [...currentPoints];
    updated[index] = { x, y };
    setCurrentPoints(updated);
  };

  const handlePointDelete = (index) => {
    const updated = [...currentPoints];
    updated.splice(index, 1);
    setCurrentPoints(updated);
  };

  const pointsToPath = (points) => {
    if (points.length === 0) return "";
    const [first, ...rest] = points;
    const move = `M ${first.x} ${first.y}`;
    const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
    return `${move} ${lines} Z`;
  };

  const handleSave = async () => {
    if (currentPoints.length < 3) {
      alert("Polygon must have at least 3 points.");
      return;
    }

    const path = pointsToPath(currentPoints);
    const { data, error } = await supabase.from("polygons").insert([
      {
        points: path,
        flat_id: selectedFlatId,
        name: selectedFlatName,
      },
    ]);

    if (error) {
      console.error("Insert error:", error.message);
      alert("❌ Failed to save polygon");
    } else {
      alert("✅ Polygon saved to Supabase!");
      setPolygons([...polygons, { path }]);
      setCurrentPoints([]);
    }
  };

  const handleNew = () => {
    setCurrentPoints([]);
  };

  const handleDeletePolygon = (index) => {
    const updated = [...polygons];
    updated.splice(index, 1);
    setPolygons(updated);
  };
  const [flats, setFlats] = useState([]);
  const [selectedFlatId, setSelectedFlatId] = useState("");
  const [selectedFlatName, setSelectedFlatName] = useState("")
  useEffect(() => {
    const fetchFlats = async () => {
      const { data, error } = await supabase.from("flats").select("*");
      if (data) setFlats(data);
    };
    fetchFlats();
  }, []);
  return (
    <>
      <section className="nav">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: 10 }}
        />

        {/* Action Buttons */}
        <div style={{ marginBottom: 10 }}>
          <button onClick={handleSave}>✅ Save Polygon</button>
          <button onClick={handleNew}>➕ New Polygon</button>
        </div>
        <select
        value={selectedFlatId}
        onChange={(e) => {
          const flat = flats.find((f) => f.id === parseInt(e.target.value));
          setSelectedFlatId(flat.id);
          setSelectedFlatName(flat.name);
        }}
        className="border p-2 ml-2"
      >
        <option value="">Select Flat</option>
        {flats.map((flat) => (
          <option key={flat.id} value={flat.id}>
            {flat.name}
          </option>
        ))}
      </select>
      </section>
      <article className="wrapper-container">
        <section className="wrapper">
        {backgroundImage && (
              <img
                src={backgroundImage}
                alt="Background"
                className="bg-img"
                onClick={handleSvgClick}
                
              />
            )}
          <svg
            width="5000"
            height="3750"
            viewBox="0 0 5000 3750"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleSvgClick}
            style={{ border: "1px solid black" }}
            ref={svgRef}
          >
            {/* Saved polygons */}
            {polygons.map((poly, i) => {
              const match = poly.path.match(
                /M\s*(-?\d+(\.\d+)?)\s*(-?\d+(\.\d+)?)/
              );
              const cx = match ? parseFloat(match[1]) : 10;
              const cy = match ? parseFloat(match[3]) - 10 : 10;

              return (
                <g key={i}>
                  <path
                    d={poly.path}
                    fill="rgba(0, 255, 0, 0.2)"
                    stroke="green"
                    strokeWidth="2"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="black"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePolygon(i);
                    }}
                  />
                </g>
              );
            })}

            {/* Current drawing polygon */}
            {currentPoints.length > 0 && (
              <>
                <polygon
                  points={currentPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(255, 0, 0, 0.3)"
                  stroke="red"
                  strokeWidth="2"
                />
                {currentPoints.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="blue"
                    onMouseDown={(e) => 
                      {
                      e.stopPropagation();
                      const onMove = (moveEvent) =>
                        handlePointDrag(moveEvent, i);
                      const onUp = () => {
                        window.removeEventListener("mousemove", onMove);
                        window.removeEventListener("mouseup", onUp);
                      };
                      window.addEventListener("mousemove", onMove);
                      window.addEventListener("mouseup", onUp);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePointDelete(i);
                    }}
                  />
                ))}
              </>
            )}
          </svg>
        </section>
      </article>
      {/* Polygon debug data */}
      <pre style={{ background: "#f0f0f0", padding: 10 }}>
        🔖 Polygon Data:
        {JSON.stringify(polygons, null, 2)}

              </pre>
    </>
  );
};

export default PolygonDrawer;
