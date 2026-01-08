import axios from "axios";

// 🚗 when vehicle is added
export const sendWhatsAppVehicleAdded = async (to, vehicleType, regNo, nextServiceDate) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "vehicle_added",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: vehicleType },
                { type: "text", text: regNo },
                { type: "text", text: nextServiceDate },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp: vehicle_added template sent");
  } catch (error) {
    console.error("❌ WhatsApp error:", error.response?.data || error.message);
  }
};


// 🔔 service reminder template (7 days / 3 days / due today)
export const sendWhatsAppServiceReminder = async (to, vehicleType, regNo, dueDate) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "service_reminder",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: vehicleType },
                { type: "text", text: regNo },
                { type: "text", text: dueDate },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp: service_reminder template sent");
  } catch (error) {
    console.error("❌ WhatsApp reminder error:", error.response?.data || error.message);
  }
};
