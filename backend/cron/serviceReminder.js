import cron from "node-cron";
import { Vehicle } from "../models/vehicle.js";
import { Notification } from "../models/notification.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  sendWhatsAppServiceReminder
} from "../services/whatsappService.js";

let cronStarted = false;

export const startServiceReminderCron = () => {
  if (cronStarted) {
    console.log("⚠️ Cron already running");
    return;
  }

  cronStarted = true;

  // runs daily at 9am
  cron.schedule("0 9 * * *", async () => {
    console.log("🔔 Running smart service reminder cron");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vehicles = await Vehicle.find().populate("user");

    for (const vehicle of vehicles) {
      if (!vehicle.user) continue;

      const nextDate = new Date(vehicle.nextServiceDate);
      nextDate.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil(
        (nextDate - today) / (1000 * 60 * 60 * 24)
      );

      const user = vehicle.user;

      // ================= 7 DAYS =================
      if (diffDays === 7 && vehicle.reminderStage !== "7_DAYS") {
        await Notification.create({
          user: user._id,
          title: "Service Reminder (7 Days)",
          message: `Service due in 7 days for ${vehicle.vehicleType} (${vehicle.registrationNumber})`,
          type: "SERVICE",
        });

        await sendEmail({
          to: user.email,
          subject: "⏰ Vehicle Service Reminder – 7 Days Left",
          html: `
            <h2>Service Reminder</h2>
            <p>Your <b>${vehicle.vehicleType}</b> (${vehicle.registrationNumber}) service is due in <b>7 days</b>.</p>
            <p>Next service date: ${nextDate.toDateString()}</p>
            <br/>
            <p>– AutoCare</p>
          `,
        });

        await sendWhatsAppServiceReminder(
          user.phone?.replace("+", ""),
          vehicle.vehicleType,
          vehicle.registrationNumber,
          nextDate.toLocaleDateString("en-GB")
        );

        vehicle.reminderStage = "7_DAYS";
        await vehicle.save();
      }

      // ================= 3 DAYS =================
      if (diffDays === 3 && vehicle.reminderStage !== "3_DAYS") {
        await Notification.create({
          user: user._id,
          title: "Service Reminder (3 Days)",
          message: `Service due in 3 days for ${vehicle.vehicleType} (${vehicle.registrationNumber})`,
          type: "SERVICE",
        });

        await sendEmail({
          to: user.email,
          subject: "⚠️ Vehicle Service Reminder – 3 Days Left",
          html: `
            <h2>Service Reminder</h2>
            <p>Your <b>${vehicle.vehicleType}</b> (${vehicle.registrationNumber}) service is due in <b>3 days</b>.</p>
            <p>Next service date: ${nextDate.toDateString()}</p>
            <br/>
            <p>– AutoCare</p>
          `,
        });

        await sendWhatsAppServiceReminder(
          user.phone?.replace("+", ""),
          vehicle.vehicleType,
          vehicle.registrationNumber,
          nextDate.toLocaleDateString("en-GB")
        );

        vehicle.reminderStage = "3_DAYS";
        await vehicle.save();
      }

      // ================= DUE TODAY =================
      if (diffDays === 0 && vehicle.reminderStage !== "DUE") {
        await Notification.create({
          user: user._id,
          title: "Service Due Today",
          message: `Service due today for ${vehicle.vehicleType} (${vehicle.registrationNumber})`,
          type: "SERVICE",
        });

        await sendEmail({
          to: user.email,
          subject: "🔔 Vehicle Service Due Today",
          html: `
            <h2>Service Due Today</h2>
            <p>Your <b>${vehicle.vehicleType}</b> (${vehicle.registrationNumber}) service is due <b>today</b>.</p>
            <br/>
            <p>– AutoCare</p>
          `,
        });

        await sendWhatsAppServiceReminder(
          user.phone?.replace("+", ""),
          vehicle.vehicleType,
          vehicle.registrationNumber,
          nextDate.toLocaleDateString("en-GB")
        );

        vehicle.reminderStage = "DUE";
        vehicle.lastServiceNotified = new Date();
        await vehicle.save();
      }
    }
  });

  console.log("✅ Smart service reminder cron started");
};
