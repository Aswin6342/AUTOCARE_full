import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Preparing email...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "OK" : "MISSING");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔍 STEP 1A: verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP verified successfully");

    // 🔍 STEP 1B: send email
    await transporter.sendMail({
      from: `"AutoCare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);
    throw error; // IMPORTANT: let controller catch it
  }
};
