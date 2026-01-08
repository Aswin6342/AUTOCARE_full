import express from "express";
import {
  addVehicle,
  getMyVehicles,
  deleteVehicle,
  updateVehicle,
  adminVehicleStats,
  getUserVehiclesForAdmin,
  getAllVehiclesForAdmin,
  adminDeleteVehicle,
} from "../controller/vehicleController.js";

import verifyToken from "../middlewear/auth.js";
import upload from "../middlewear/upload.js";
import adminOnly from "../middlewear/adminOnly.js";

const vehicleRouter = express.Router();

/* ================= USER ROUTES ================= */

// add vehicle
vehicleRouter.post(
  "/add",
  verifyToken,
  upload.single("photo"),
  addVehicle
);

// get logged-in user's vehicles
vehicleRouter.get(
  "/my",
  verifyToken,
  getMyVehicles
);

// update vehicle (user owns it)
vehicleRouter.put(
  "/update/:id",
  verifyToken,
  upload.single("photo"),
  updateVehicle
);


// delete vehicle (user owns it)
vehicleRouter.delete(
  "/delete/:id",
  verifyToken,
  deleteVehicle
);

/* ================= ADMIN ROUTES ================= */

// vehicle statistics (dashboard)
vehicleRouter.get(
  "/admin/stats",
  verifyToken,
  adminOnly,
  adminVehicleStats
);

// vehicles of ONE specific user
vehicleRouter.get(
  "/admin/user/:userId/vehicles",
  verifyToken,
  adminOnly,
  getUserVehiclesForAdmin
);

// ALL vehicles (manage vehicles page)
vehicleRouter.get(
  "/admin/all",
  verifyToken,
  adminOnly,
  getAllVehiclesForAdmin
);

// admin delete ANY vehicle
vehicleRouter.delete(
  "/admin/delete/:id",
  verifyToken,
  adminOnly,
  adminDeleteVehicle
);

export default vehicleRouter;
