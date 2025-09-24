// api/sendNotification.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.TO_NUMBER,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ success: false, error: data.error });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Failed to send notification:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
