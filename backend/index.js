import express from "express";
import cors from "cors";
import { connectToDB } from "./fordb/db.js";

import userrouter from "./Router/userrouter.js";
import vehicleRouter from "./Router/vehicleRouter.js";
import notificationRouter from "./Router/notificationRouter.js";

import { startServiceReminderCron } from "./cron/serviceReminder.js";

const app = express();
const port = process.env.PORT || 5000;

/* =======================
   ✅ CORS (FIXED)
======================= */
const allowedOrigins = [
  "https://autocare-full.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =======================
   BODY PARSERS
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   TEST ROUTE (IMPORTANT)
======================= */
app.get("/", (req, res) => {
  res.send("AutoCare Backend Running 🚀");
});

/* =======================
   ROUTES
======================= */
app.use("/user", userrouter);
app.use("/vehicle", vehicleRouter);
app.use("/notification", notificationRouter);

/* =======================
   DB + SERVER + CRON
======================= */
connectToDB()
  .then(() => {
    console.log("✅ Database connected");

    startServiceReminderCron();

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to DB:", error);
  });

export default app;
