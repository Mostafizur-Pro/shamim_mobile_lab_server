import multer from "multer";
import path from "path";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/hallRoomPost");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const uploadHallRoom = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Middleware for serving static files
app.use("/images", express.static(path.join(__dirname, "images")));
