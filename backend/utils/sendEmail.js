import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "FOUND" : "MISSING");
    console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "FOUND" : "MISSING");

    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ IMPORTANT CHANGE
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // ✅ avoid long hang
    });

    const info = await transporter.sendMail({
      from: `"AutoCare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ EMAIL ERROR FULL:", error);
    throw error;
  }
};
