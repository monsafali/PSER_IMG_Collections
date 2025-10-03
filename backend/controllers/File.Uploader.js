import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import File from "../model/File.model.js";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isFileTypeSupported(filetype, supportedTypes) {
  return supportedTypes.includes(filetype);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";

  if (quality) {
    options.quality = quality;
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export const imageUploader = async (req, res) => {
  try {
    const { RespondentName, Phone, HouseSerialNo } = req.body;
    const file = req.files.imageFile;

    const supportedTypes = ["jpg", "jpeg", "png"];
    // const fileType = file.name.split(".")[1];
    const fileType = path.extname(file.name).slice(1).toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes))
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });

    // File formate

    const response = await uploadFileToCloudinary(file, "codehelp");
    console.log(response);
    // Db men entry save krni haai

    const fileData = await File.create({
      RespondentName,
      Phone,
      HouseSerialNo,
      imageUrl: response.secure_url,
      public_id: response.public_id,
    });

    res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      file: fileData,
      message: "image succesfuly uploaed ",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Someting went wrong ",
    });
  }
};

// Controller: Get all uploaded images by user email
export const getUserImages = async (req, res) => {
  try {
    const { Phone } = req.query;
    const files = await File.find({ Phone });
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch images" });
  }
};

export const DeleteFile = async (req, res) => {
  try {
    const deleted = await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
