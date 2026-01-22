import express from "express";
import cors from "cors";
import { connectToDB } from "./fordb/db.js";

import userrouter from "./Router/userrouter.js";
import vehicleRouter from "./Router/vehicleRouter.js";
import notificationRouter from "./Router/notificationRouter.js";

import { startServiceReminderCron } from "./cron/serviceReminder.js";

const app = express();
const port = 5000;

/* =======================
   ✅ CORS (ENOUGH FOR PREFLIGHT)
======================= */

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://autocare-front.onrender.com"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));


const allowedOrigins = [
   "https://autocare-front.onrender.com",
  "http://localhost:5173",
];



app.use(cors({
  origin: true,
  credentials: true,
}));



/* =======================
   BODY PARSERS
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to DB:", error);
  });

export default app;
