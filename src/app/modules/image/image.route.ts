import express from "express";
import { ImageController } from "./image.controller";
import path from "path";

const router = express.Router();

// router.get("/uploads/:imageName", ImageController.getImage);

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handle requests for individual images
router.get("/uploads/:imageName", ImageController.getImage);
router.get("/uploads/images/user/:imageName", ImageController.getUserImage);
router.get("/uploads/images/client/:imageName", ImageController.getClientImage);
router.get(
  "/uploads/images/admin_image/:imageName",
  ImageController.getAdminImage
);
router.get(
  "/uploads/images/Employee/:imageName",
  ImageController.getEmployeeImage
);
router.get(
  "/uploads/images/paidImage/:imageName",
  ImageController.getPaidImage
);
router.get(
  "/uploads/images/hallRoomPost/:imageName",
  ImageController.getHallRoomPost
);

export const imageRoutes = router;
