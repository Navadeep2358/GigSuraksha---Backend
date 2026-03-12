const https = require("https");

https.get("https://api.twilio.com", (res) => {
  console.log("Connected to Twilio API. Status:", res.statusCode);
}).on("error", (err) => {
  console.log("Connection failed:", err.message);
});