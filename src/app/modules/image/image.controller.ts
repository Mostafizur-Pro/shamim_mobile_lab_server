import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
const path = require("path");
const express = require("express");

const app = express();

const getImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    imageName
  );

  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});

const getClientImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  // console.log('data', imageName)

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "client",
    imageName
  );
  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});
const getUserImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "user",
    imageName
  );
  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});

const getAdminImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "admin_image",
    imageName
  );

  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});

const getEmployeeImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "employee",
    imageName
  );

  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});
const getPaidImage = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "paidImage",
    imageName
  );
  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});
const getHallRoomPost = catchAsync(async (req: Request, res: Response) => {
  const { imageName } = req.params;

  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    // "uploads",
    "images",
    "hallRoomPost",
    imageName
  );
  const cacheControl = `public, max-age=${3600 * 24 * 30}`; // Cache for 30 days
  res.set("Cache-Control", cacheControl);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("Image not found");
    }
  });
});





export const ImageController = {
  getImage,
  getClientImage,
  getUserImage,
  getAdminImage,
  getEmployeeImage,
  getPaidImage,
  getHallRoomPost,

};
