
// import { useEffect, useState } from "react";
// import { useAuth } from "../AuthContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Welcome = () => {
//   const { user, logout } = useAuth();
//   const [images, setImages] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);

//   const [formData, setFormData] = useState({
//     RespondentName: "",
//     Phone: "",
//     HouseSerialNo: "",
//     imageFile: null,
//   });

//   const navigate = useNavigate();

//   // ✅ Fetch only logged-in user's images
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const res = await axios.get("/api/v1/files/user-images", {
//           params: { email: user.email }, // Filter by user email
//           withCredentials: true,
//         });
//         setImages(res.data.files || []);
//       } catch (err) {
//         console.error("Error fetching images", err);
//       }
//     };

//     if (user?.email) fetchImages();
//   }, [user]);

//   // Handle form inputs
//   const handleChange = (e) => {
//     if (e.target.name === "imageFile") {
//       setFormData({ ...formData, imageFile: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   // ✅ Upload image with user.email attached
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!formData.imageFile) return alert("Select a file");

//     const data = new FormData();
//     data.append("RespondentName", formData.RespondentName);
//     data.append("Phone", formData.Phone);
//     data.append("HouseSerialNo", formData.HouseSerialNo);
//     data.append("imageFile", formData.imageFile);
//     data.append("email", user.email); // 👈 Important: attach user email

//     try {
//       setIsUploading(true);

//       const res = await axios.post("/api/v1/files/upload-image", data, {
//         withCredentials: true,
//       });

//       if (res.data?.file) {
//         setImages((prev) => [...prev, res.data.file]);
//       } else {
//         const imgRes = await axios.get("/api/v1/files/user-images", {
//           params: { email: user.email },
//           withCredentials: true,
//         });
//         setImages(imgRes.data.files || []);
//       }

//       setFormData({
//         RespondentName: "",
//         Phone: "",
//         HouseSerialNo: "",
//         imageFile: null,
//       });
//       alert("Upload successful");
//     } catch (error) {
//       console.error(error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please login again.");
//         logout();
//         navigate("/login");
//       } else {
//         alert("Upload failed");
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-4">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-blue-600">
//           Welcome, {user?.name || "User"}! 🎉
//         </h1>
//         <p className="mt-2 text-gray-600">You're successfully logged in.</p>
//         <button
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Upload Form */}
//       <form
//         onSubmit={handleUpload}
//         className="bg-white shadow-md rounded p-6 mb-8"
//       >
//         <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
//         <div className="flex flex-col gap-4">
//           <input
//             type="text"
//             name="RespondentName"
//             placeholder="Respondent Name"
//             value={formData.RespondentName}
//             onChange={handleChange}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             name="Phone"
//             placeholder="Enter Phone Number"
//             value={formData.Phone}
//             onChange={handleChange}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             name="HouseSerialNo"
//             placeholder="Enter House Serial No"
//             value={formData.HouseSerialNo}
//             onChange={handleChange}
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="file"
//             name="imageFile"
//             accept="image/*"
//             capture="environment"
//             onChange={handleChange}
//             className="p-2 border rounded"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
//             disabled={isUploading}
//           >
//             {isUploading ? (
//               <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               "Upload"
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Display Images */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Your Uploaded Images</h2>
//         {images.length === 0 ? (
//           <p className="text-gray-500">No images uploaded yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {images.map((img) => (
//               <div
//                 key={img._id}
//                 className="border rounded-lg shadow p-2 flex flex-col"
//               >
//                 <img
//                   src={img.imageUrl}
//                   alt={img.RespondentName}
//                   className="w-full h-48 object-cover rounded"
//                 />
//                 <div className="mt-2">
//                   <p className="font-semibold">
//                     <span className="font-bold">Name: </span>
//                     {img.RespondentName}
//                   </p>
//                   <p className="text-sm font-semibold">
//                     <span className="font-bold">Phone: </span>
//                     {img.Phone}
//                   </p>
//                   <p className="text-sm font-semibold">
//                     <span className="font-bold">H_Serial_NO: </span>
//                     {img.HouseSerialNo}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Welcome;



import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const { user, logout } = useAuth();
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    RespondentName: "",
    Phone: "",
    HouseSerialNo: "",
    imageFile: null,
  });

  const navigate = useNavigate();

  // ✅ Fetch only logged-in user's images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/v1/files/user-images", {
          params: { email: user.email },
          withCredentials: true,
        });
        setImages(res.data.files || []);
      } catch (err) {
        console.error("Error fetching images", err);
      }
    };

    if (user?.email) fetchImages();
  }, [user]);

  // Handle form inputs
  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Upload image with user.email attached
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.imageFile) return alert("Select a file");

    const data = new FormData();
    data.append("RespondentName", formData.RespondentName);
    data.append("Phone", formData.Phone);
    data.append("HouseSerialNo", formData.HouseSerialNo);
    data.append("imageFile", formData.imageFile);
    data.append("email", user.email); // 👈 attach user email

    try {
      setIsUploading(true);

      const res = await axios.post("/api/v1/files/upload-image", data, {
        withCredentials: true,
      });

      if (res.data?.file) {
        setImages((prev) => [...prev, res.data.file]);
      } else {
        const imgRes = await axios.get("/api/v1/files/user-images", {
          params: { email: user.email },
          withCredentials: true,
        });
        setImages(imgRes.data.files || []);
      }

      setFormData({
        RespondentName: "",
        Phone: "",
        HouseSerialNo: "",
        imageFile: null,
      });
      alert("Upload successful");
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

  // ✅ Filter images based on search term (frontend only)
  const filteredImages = images.filter((img) => {
    const term = searchTerm.toLowerCase();
    return (
      img.RespondentName?.toLowerCase().includes(term) ||
      img.Phone?.toString().includes(term) ||
      img.HouseSerialNo?.toString().includes(term)
    );
  });

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

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="RespondentName"
            placeholder="Respondent Name"
            value={formData.RespondentName}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="Phone"
            placeholder="Enter Phone Number"
            value={formData.Phone}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="HouseSerialNo"
            placeholder="Enter House Serial No"
            value={formData.HouseSerialNo}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
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

      {/* ✅ Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Phone, or House Serial No..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Display Filtered Images */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Uploaded Images</h2>
        {filteredImages.length === 0 ? (
          <p className="text-gray-500">No images found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img._id}
                className="border rounded-lg shadow p-2 flex flex-col"
              >
                <img
                  src={img.imageUrl}
                  alt={img.RespondentName}
                  className="w-full h-48 object-cover rounded"
                />
                <div className="mt-2">
                  <p className="font-semibold">
                    <span className="font-bold">Name: </span>
                    {img.RespondentName}
                  </p>asdfasdfall
                  <p className="text-sm font-semibold">
                    <span className="font-bold">Phone: </span>
                    {img.Phone}
                  </p>
                  <p className="text-sm font-semibold">
                    <span className="font-bold">H_Serial_NO: </span>
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
