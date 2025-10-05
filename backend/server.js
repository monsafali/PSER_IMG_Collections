import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser"; // important for auth
import UserRouter from "./routers/user.router.js";
import FileRouter from "./routers/File.router.js";

import fileUpload from "express-fileupload";
import connetCloud from "./config/cloudinary.js";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

// // Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    httpOnly: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // required for JWT in cookies

app.use("/api/v1", UserRouter);
app.use("/api/v1/files", FileRouter);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

// Init Cloudinary
connetCloud();

// Start server
app.listen(port, () => {
  dbConnection();
  console.log("Server started successfully on port", port);
});
