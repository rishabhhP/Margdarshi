// api/sendNotification.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    // Send message via WhatsApp API
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

    // Parse JSON response
    const data = await response.json();

    if (data.error) {
      console.error("WhatsApp API error:", data.error);
      return res.status(500).json({ success: false, error: data.error });
    }

    // Success
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
