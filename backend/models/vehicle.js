import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user1",
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["Car", "Bike", "Scooter"],
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
    },

    manufacturingYear: {
      type: Number,
      required: true,
    },

    kmDriven: {
      type: Number,
      required: true,
    },

    lastServiceDate: {
      type: Date,
      required: true,
    },

    reminderMonths: {
      type: Number,
      default: 6,
    },

    nextServiceDate: {
      type: Date,
      required: true,
    },

    lastServiceNotified: {
      type: Date,
      default: null,
    },
    reminderStage: {
      type: String,
      enum: ["NONE", "7_DAYS", "3_DAYS", "DUE"],
      default: "NONE",
    },

    // 📸 Vehicle photo
    photo: {
      type: String, // URL or filename
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);

