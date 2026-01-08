import axios from "axios";

export const sendWhatsAppMessage = async (to, text) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp message sent");
  } catch (error) {
    console.error(
      "❌ WhatsApp error:",
      error.response?.data || error.message
    );
  }
};
