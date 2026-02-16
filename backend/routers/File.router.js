import express from "express";
import fileUpload from "express-fileupload";
import {
  imageUploader,
  getUserImages,
} from "../controllers/File.Uploader.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Middleware for file uploads
router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));



// Routes
router.post("/upload-image", authenticate, imageUploader);
router.get("/user-images", authenticate, getUserImages);

export default router;
