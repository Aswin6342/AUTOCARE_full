import { Notification } from "../models/notification.js";
import { Vehicle } from "../models/vehicle.js";
import { user1 } from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= ADD VEHICLE (USER) ================= */
export const addVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      registrationNumber,
      manufacturingYear,
      kmDriven,
      lastServiceDate,
      reminderMonths,
    } = req.body;

    const userId = req.user.userId;

    if (!lastServiceDate) {
      return res.status(400).json({
        success: false,
        message: "Last service date is required",
      });
    }

    const user = await user1.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const nextServiceDate = new Date(lastServiceDate);
    nextServiceDate.setMonth(
      nextServiceDate.getMonth() + Number(reminderMonths || 6)
    );

    const photo = req.file ? req.file.path : "";

    const newVehicle = await Vehicle.create({
      user: userId,
      vehicleType,
      registrationNumber,
      manufacturingYear,
      kmDriven,
      lastServiceDate,
      reminderMonths,
      nextServiceDate,
      photo,
      lastServiceNotified: null,
    });

    // 🔔 Notification (already working)
    await Notification.create({
      user: userId,
      title: "Vehicle Added",
      message: `${vehicleType} (${registrationNumber}) added successfully`,
      type: "VEHICLE",
    });

    // 📧 EMAIL (RESTORED – this was missing)
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: "🚗 Vehicle Added – AutoCare",
        html: `
          <h2>Vehicle Added Successfully</h2>
          <p>Your <b>${vehicleType}</b> with registration number 
          <b>${registrationNumber}</b> has been added.</p>
          <p><b>Next Service Date:</b> ${nextServiceDate.toDateString()}</p>
          <br/>
          <p>– AutoCare Team</p>
        `,
      });
    }

    res.status(201).json({
      success: true,
      vehicle: newVehicle,
    });
} catch (error) {
  console.error("❌ ADD VEHICLE ERROR:", error.message);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}


/* ================= GET MY VEHICLES (USER) ================= */
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vehicles });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

/* ================= UPDATE VEHICLE (USER) ================= */
export const updateVehicle = async (req, res) => {
  try {
    const {
      vehicleType,
      registrationNumber,
      manufacturingYear,
      kmDriven,
      lastServiceDate,
      reminderMonths,
    } = req.body;

    const updateData = {
      vehicleType,
      registrationNumber,
      manufacturingYear,
      kmDriven,
      reminderMonths,
    };

    // 🗓️ recalculate next service date
    if (lastServiceDate && reminderMonths) {
      const nextServiceDate = new Date(lastServiceDate);
      nextServiceDate.setMonth(
        nextServiceDate.getMonth() + Number(reminderMonths)
      );

      updateData.lastServiceDate = lastServiceDate;
      updateData.nextServiceDate = nextServiceDate;

      // reset reminders
      updateData.reminderStage = null;
      updateData.lastServiceNotified = null;
    }

    // 📸 photo update
    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      vehicle: updatedVehicle,
    });
} catch (error) {
  console.error("❌ ADD VEHICLE ERROR:", error.message);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}



/* ================= DELETE VEHICLE (USER) ================= */
export const deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};

/* ================= ADMIN: VEHICLE STATS ================= */
export const adminVehicleStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();

    const cars = await Vehicle.countDocuments({ vehicleType: "Car" });
    const bikes = await Vehicle.countDocuments({ vehicleType: "Bike" });
    const scooters = await Vehicle.countDocuments({ vehicleType: "Scooter" });

    res.json({
      success: true,
      totalVehicles,
      cars,
      bikes,
      scooters,
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* ================= ADMIN: GET ALL VEHICLES ================= */
export const getAllVehiclesForAdmin = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, vehicles });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

/* ================= ADMIN: GET VEHICLES OF ONE USER ================= */
export const getUserVehiclesForAdmin = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, vehicles });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user vehicles",
    });
  }
};

/* ================= ADMIN DELETE VEHICLE ================= */
export const adminDeleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted by admin",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};
