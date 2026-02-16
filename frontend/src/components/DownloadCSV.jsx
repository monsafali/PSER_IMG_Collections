import { useState } from "react";
import axios from "axios";

const DownloadCSV = () => {
  const [loading, setLoading] = useState(false);

  const downloadCSV = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/v1/files/user-images", {
        withCredentials: true,
      });

      const files = res.data.files;

      if (!files || files.length === 0) {
        alert("No data found");
        return;
      }

      // ✅ CSV Headers
      const headers = [
        "Name",
        "Fathername",
        "Phone",
        "CNIC",
        "Upload Date",
        "Upload Time",
        "Image URL",
      ];

      // ✅ Convert Data
      const rows = files.map((file) => {
        const dateObj = new Date(file.createdAt);

        return [
          file.Name,
          file.Fathername,
          file.Phone,
          file.CNIC,
          dateObj.toLocaleDateString(),
          dateObj.toLocaleTimeString(),
          file.imageUrl,
        ];
      });

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      // ✅ Create Blob
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `User_Data_${new Date().toLocaleDateString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Failed to download CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={downloadCSV}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Preparing CSV..." : "Download CSV"}
      </button>
    </div>
  );
};

export default DownloadCSV;
