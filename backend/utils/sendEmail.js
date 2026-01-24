import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Email ENV CHECK:", {
      user: process.env.EMAIL_USER ? "OK" : "MISSING",
      pass: process.env.EMAIL_PASS ? "OK" : "MISSING",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📧 Transporter created");

    const info = await transporter.sendMail({
      from: `"AutoCare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    throw error; // VERY IMPORTANT
  }
};

