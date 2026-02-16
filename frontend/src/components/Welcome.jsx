


import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DownloadCSV from "./DownloadCSV";

const Welcome = () => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ New: Date filter (default = today)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [formData, setFormData] = useState({
    Name: "",
    Fathername: "",
    Phone: "",
    CNIC: "",
    imageFile: null,
  });

  const navigate = useNavigate();

  // Fetch user images
  useEffect(() => {
    if (!user) return;

    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/v1/files/user-images", {
          withCredentials: true,
        });
        setImages(res.data.files || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    fetchImages();
  }, [user, logout, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("Fathername", formData.Fathername);
    data.append("Phone", formData.Phone);
    data.append("CNIC", formData.CNIC);
    data.append("imageFile", formData.imageFile);

    try {
      setIsUploading(true);

      const res = await axios.post("/api/v1/files/upload-image", data, {
        withCredentials: true,
      });

      // ✅ Add new upload instantly
      setImages((prev) => [res.data.file, ...prev]);

      setFormData({
        Name: "",
        Fathername: "",
        Phone: "",
        CNIC: "",
        imageFile: null,
      });

      alert("Upload successful");
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        alert("Upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Filter by search + selected date
  const filteredImages = images.filter((img) => {
    const term = searchTerm.toLowerCase();
    const imageDate = new Date(img.createdAt).toISOString().split("T")[0];

    return (
      imageDate === selectedDate &&
      (img.Name?.toLowerCase().includes(term) ||
        img.Phone?.toString().includes(term) ||
        img.CNIC?.toString().includes(term))
    );
  });
  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const today = formatDate(new Date());

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDate(yesterdayDate);

  // Counts
  const totalCount = images.length;

  const todayCount = images.filter(
    (img) => formatDate(img.createdAt) === today,
  ).length;

  const yesterdayCount = images.filter(
    (img) => formatDate(img.createdAt) === yesterday,
  ).length;

  const selectedDateCount = images.filter(
    (img) => formatDate(img.createdAt) === selectedDate,
  ).length;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 shadow rounded mb-8"
      >
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={formData.Name}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-3"
          required
        />
        <input
          type="text"
          name="Fathername"
          placeholder="Father Name"
          value={formData.Fathername}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-3"
          required
        />
        <input
          type="number"
          name="Phone"
          placeholder="Phone"
          value={formData.Phone}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-3"
          required
        />
        <input
          type="number"
          name="CNIC"
          placeholder="CNIC"
          value={formData.CNIC}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-3"
          required
        />
        <input
          type="file"
          name="imageFile"
          onChange={handleChange}
          className="p-2 border rounded w-full mb-3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* 📊 Dashboard Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded text-center">
          <h3 className="font-bold text-lg">Total</h3>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>

        <div className="bg-green-100 p-4 rounded text-center">
          <h3 className="font-bold text-lg">Today</h3>
          <p className="text-2xl font-bold">{todayCount}</p>
        </div>

        <div className="bg-purple-100 p-4 rounded text-center">
          <h3 className="font-bold text-lg">Selected Date</h3>
          <p className="text-2xl font-bold">{selectedDateCount}</p>
        </div>
      </div>

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* 📅 Date Filter */}
      <div className="mb-6">
        <label className="font-semibold mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Download CSV */}
      <DownloadCSV />

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredImages.length === 0 ? (
          <p className="text-gray-500">No data found for selected date.</p>
        ) : (
          filteredImages.map((img) => (
            <div key={img._id} className="border p-3 rounded shadow">
              <img
                src={img.imageUrl}
                alt={img.Name}
                className="w-full h-40 object-cover rounded"
              />
              <p>
                <strong>Name:</strong> {img.Name}
              </p>
              <p>
                <strong>Phone:</strong> {img.Phone}
              </p>
              <p>
                <strong>CNIC:</strong> {img.CNIC}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(img.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};;

export default Welcome;
