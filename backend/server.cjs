const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 5000;

// 🔑 WhatsApp API credentials (hardcoded)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TO_NUMBER = process.env.TO_NUMBER;



const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173" // allow your frontend
}));
app.use(bodyParser.json());


app.post("/api/sendNotification", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: TO_NUMBER,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();
    console.log("WhatsApp API response:", data);

    if (data.error) return res.status(500).json({ success: false, error: data.error });
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to send notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


