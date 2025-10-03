import express from "express";
import fileUpload from "express-fileupload";
import {
  imageUploader,
  getUserImages,
  DeleteFile,
} from "../controllers/File.Uploader.js";

const router = express.Router();

// Middleware for file uploads
router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// Routes
router.post("/upload-image", imageUploader);
router.get("/user-images", getUserImages);
router.delete("/delete/:id", DeleteFile);

export default router;
