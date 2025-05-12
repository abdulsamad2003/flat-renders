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
    shapespark_url: "",
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
    setFormData({ name: "", bhk: "", floor: "", available: true, shapespark_url: "" });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Make sure to check if BHK is a valid number or parse it correctly
    const { name, bhk, floor, available, shapespark_url } = formData;
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
        shapespark_url,
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
    // Update the floor_image_url column in flats table

    const { error: updateError } = await supabase
      .from("flats")
      .update({ floor_image_url: publicUrl })
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
        <h1 className="main-font">Admin -Dashboard</h1>
        <div className="nav-buttons">
          <button className="primary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="admin-container">
        <table className="flat-table">
          <thead>
            <tr>
              <th>Flat Name</th>
              <th>Update Details</th>
              <th>BHK</th>
              <th>Floor</th>
              <th>Available</th>
              <th>Shapespark_url</th>
              <th>Floor-plain-image</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.name}</td>
                <td>
                  <button
                    className="primary-btn"
                    onClick={() => handleOpenModal(flat)}
                  >
                    Update
                  </button>
                </td>
                <td>{flat.bhk}</td>
                <td>{flat.floor}</td>
                <td>{flat.available ? "Yes" : "No"}</td>
                <td>{flat.shapespark_url}</td>
                <td>
                  {flat.floor_image_url ? (
                    <a
                      href={flat.floor_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      {flat.floor_image_url.split("/").pop().split("?")[0]}
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
              <h3 className="main-font">Update Flat: {selectedFlat.name}</h3>
              <form className="update-form" onSubmit={handleUpdate}>
                <span>
                <label htmlFor="name">
                  Flat Name
                </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter flat name"
                  />
                </span>

              <span>
                <label htmlFor="bhk">
                  BHK
                </label>
                  <input
                    id="bhk"
                    type="text"
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                    placeholder="e.g. 2 BHK"
                  />
              </span>
                <span>
                <label htmlFor="floor">
                  Floor
                </label>
                  <input
                    id="floor"
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="Enter floor number"
                  />
                </span>
                <span>
                <label htmlFor="shapespark_url" className="checkbox">
                  shapespark_url
                </label>
                  <input
                    id="shapespark_url"
                    placeholder="Enter shapespark_url"
                    type="text"
                    name="shapespark_url"
                    checked={formData.shapespark_url}
                    onChange={handleChange}
                  />
                </span>
                <span>
                <label htmlFor="checkbox" className="checkbox">
                  Available
                </label>
                  <input
                    id="checkbox"
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                </span>
                <span>  
                <label htmlFor="file-upload">
                  Upload Floor Plan Image
                </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </span>
                <div className="form-buttons">
                  <button type="submit">Update</button>
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
