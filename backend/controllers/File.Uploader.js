
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
    const { Name, Phone, Fathername, CNIC } = req.body;
    const file = req.files.imageFile;

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = path.extname(file.name).slice(1).toLowerCase();

    if (!supportedTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "PSERCARDS");

    const fileData = await File.create({
      user: req.user.id, // ✅ link to logged in user
      Name,
      Phone,
      Fathername,
      CNIC,
      imageUrl: response.secure_url,
      public_id: response.public_id,
    });

    res.status(200).json({
      success: true,
      file: fileData,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



export const getUserImages = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
    });
  }
};
