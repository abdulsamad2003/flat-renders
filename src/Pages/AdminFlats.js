import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AdminFlats.scss"; // Style modal here
import { useNavigate } from "react-router-dom";

const AdminFlats = () => {
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bhk: "",
    floor: "",
    available: true,
  });

  // Fetch all flats
  const fetchFlats = async () => {
    const { data, error } = await supabase
      .from("flats")
      .select("*")
      .order("name", { ascending: true });
    if (error) console.error("Fetch Error:", error);
    else setFlats(data);
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  // Open modal with flat data
  const handleOpenModal = (flat) => {
    setSelectedFlat(flat);
    setFormData(flat);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedFlat(null);
    setFormData({ name: "", bhk: "", floor: "", available: true });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Make sure to check if BHK is a valid number or parse it correctly
    const { name, bhk, floor, available } = formData;
    // Make sure bhk is a valid number
    if (isNaN(bhk)) {
      console.error("Invalid BHK value");
      return; // Return early if BHK is invalid
    }
    const { error } = await supabase
      .from("flats")
      .update({
        name,
        bhk: bhk,
        floor: parseInt(floor),
        available,
      })
      .eq("id", selectedFlat.id);

    if (error) {
      console.error("Update Error:", error);
    } else {
      handleCloseModal();
      fetchFlats(); // Re-fetch flats after updating
    }
  };

  const [file, setFile] = useState(null);
  const handleUpload = async () => {
    if (!selectedFlat) {
      console.error("No flat selected for upload");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${selectedFlat.name}.${fileExt}`;
    const filePath = `floor-plains/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("flats-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    // Get public URL
    const { data: UrlData } = supabase.storage
    .from("flats-images")
    .getPublicUrl(filePath);

  const publicUrl = `${UrlData.publicUrl}?t=${Date.now()}`;
    // Update the image_url column in flats table

    const { error: updateError } = await supabase
      .from("flats")
      .update({ image_url: publicUrl })
      .eq("name", selectedFlat.name);

    if (updateError) {
      console.error("Update table failed:", updateError.message);
    } else {
      fetchFlats(); // 👈 Refresh UI with latest image
    }
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin"); // Redirect back to login page
  };

  return (
    <>
      <nav>
        <h1>Admin - Manage Flats</h1>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="admin-container">
        <table className="flat-table">
          <thead>
            <tr>
              <th>Flat</th>
              <th>BHK</th>
              <th>Floor</th>
              <th>Available</th>
              <th>Floor-plain-image</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td className="clickable" onClick={() => handleOpenModal(flat)}>
                  {flat.name}
                </td>
                <td>{flat.bhk}</td>
                <td>{flat.floor}</td>
                <td>{flat.available ? "Yes" : "No"}</td>
                <td>
                  {flat.image_url ? (
                    <a
                      href={flat.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                    {flat.image_url.split("/").pop().split("?")[0]}
                    </a>
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedFlat && (
          <div className="modal">
            <div className="modal-content">
              <h3>Update Flat: {selectedFlat.name}</h3>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Flat Name"
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>BHK</span>
                  <input
                    type="text"
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                  />
                </div>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="Floor"
                />
                <label>
                  Available:{" "}
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                </label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button type="button" onClick={handleUpload}>
                    Upload Image
                  </button>
                </div>
                <div className="buttons">
                  <button type="submit" onClick={handleUpdate}>
                    Update
                  </button>
                  <button type="button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminFlats;
