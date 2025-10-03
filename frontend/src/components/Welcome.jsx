import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    RespondentName: "",
    Phone: "",
    HouseSerialNo: "",
    imageFile: null,
  });

  const navigate = useNavigate();

  // Fetch uploaded images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/v1/files/user-images", {
          params: { email: user.email },
          withCredentials: true,
        });
        setImages(res.data.files);
      } catch (err) {
        console.error("Error fetching images", err);
      }
    };
    if (user?.Phone) fetchImages();
  }, [user]);

  // Handle form inputs
  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.imageFile) return alert("Select a file");

    const data = new FormData();
    data.append("RespondentName", formData.RespondentName);
    data.append("Phone", formData.Phone);
    data.append("HouseSerialNo", formData.HouseSerialNo);
    data.append("imageFile", formData.imageFile);

    try {
      setIsUploading(true);

      const res = await axios.post("/api/v1/files/upload-image", data, {
        withCredentials: true,
      });

      if (res.data?.file) {
        alert("Upload successful");
        setImages((prev) => [...prev, res.data.file]);
      } else if (res.data?.files?.[0]) {
        alert("Upload successful");
        setImages((prev) => [...prev, res.data.files[0]]);
      } else if (res.data?.fileId) {
        alert("Upload successful");
        const fileRes = await axios.get(`/api/v1/files/${res.data.fileId}`, {
          withCredentials: true,
        });

        if (fileRes.data?.file) {
          setImages((prev) => [...prev, fileRes.data.file]);
        } else {
          const imgRes = await axios.get("/api/v1/files/user-images", {
            params: { Phone: formData.Phone || user.Phone },
            withCredentials: true,
          });
          setImages(imgRes.data.files);
        }
      } else {
        alert("Image uploaded successfully.");
        const imgRes = await axios.get("/api/v1/files/user-images", {
          params: { Phone: formData.Phone || user.Phone },
          withCredentials: true,
        });
        setImages(imgRes.data.files);
      }

      setFormData({
        RespondentName: "",
        Phone: "",
        HouseSerialNo: "",
        imageFile: null,
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        logout();
        navigate("/login");
      } else {
        alert("Upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome, {user?.name || "User"}! 🎉
        </h1>
        <p className="mt-2 text-gray-600">You're successfully logged in.</p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="RespondentName"
            placeholder="RespondentName"
            value={formData.RespondentName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="Phone"
            placeholder="Enter Responed Number"
            value={formData.Phone}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="HouseSerialNo"
            placeholder="Enter HouseSerialNo)"
            value={formData.HouseSerialNo}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          {/* Camera-enabled input */}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Uploaded Images</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                className="border rounded-lg shadow p-2 flex flex-col "
              >
                <img
                  src={img.imageUrl}
                  alt={img.name}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-2 ">
                  <p className="font-semibold">
                    <span className="font-bold">Name: </span>
                    {img.RespondentName}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="font-bold">Phone: </span>
                    {img.Phone}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="font-bold ">H_Serial_NO: </span>
                    {img.HouseSerialNo}
                  </p>
        
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
