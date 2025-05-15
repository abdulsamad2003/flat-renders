// AdminDashboard.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // your Supabase config

export default function AdminDashboard() {
  const [imageUrl, setImageUrl] = useState(null);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlatId, setSelectedFlatId] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  // Fetch flat options
  useEffect(() => {
    const fetchFlats = async () => {
      const { data, error } = await supabase.from("flats").select("*");
      if (data) setFlats(data);
    };
    fetchFlats();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("flats-images")
      .upload(`${file.name}`, file, { upsert: true });

    if (data) {
      const url = supabase.storage.from("flats-images").getPublicUrl(data.path).data.publicUrl;
      setImageUrl(url);
    }
  };

  const handleSvgClick = (e) => {
    if (!isDrawing) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoints([...currentPoints, { x, y }]);
  };

  const generateSvgPath = (points) =>
    `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

  const handleSave = async () => {
    if (!selectedFlatId || currentPoints.length < 3 || !imageUrl) {
      alert("Please complete all fields");
      return;
    }

    const svgPath = generateSvgPath(currentPoints);

    const { data, error } = await supabase.from("polygons").insert({
      flat_id: selectedFlatId,
      points: svgPath,
    });

    if (error) {
      console.error(error);
      alert("Failed to save");
    } else {
      alert("Saved successfully");
      setCurrentPoints([]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Polygon Drawer</h2>

      <input type="file" onChange={handleUpload} />
      <select
        value={selectedFlatId}
        onChange={(e) => setSelectedFlatId(e.target.value)}
        className="border p-2 ml-2"
      >
        <option value="">Select Flat</option>
        {flats.map((flat) => (
          <option key={flat.id} value={flat.id}>
            {flat.name}
          </option>
        ))}
      </select>

      <button onClick={() => setIsDrawing(!isDrawing)} className="ml-2 px-4 py-2 bg-blue-500 text-white">
        {isDrawing ? "Stop Drawing" : "Start Drawing"}
      </button>
      <button onClick={handleSave} className="ml-2 px-4 py-2 bg-green-500 text-white">
        Save Polygon
      </button>

      {imageUrl && (
        <svg
          width={imageUrl.width || "100%"}
          height={imageUrl.height || "500px"}
          viewBox={`0 0 ${imageUrl.width || "100%"} ${imageUrl.height || "500px"}`}
          onClick={handleSvgClick}
          style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", marginTop: 20 }}
        >
          {currentPoints.length > 0 && (
            <path
              d={generateSvgPath(currentPoints)}
              fill="rgba(0,0,0,0.3)"
              stroke="black"
              strokeWidth={2}
            />
          )}
        </svg>
      )}
    </div>
  );
}
