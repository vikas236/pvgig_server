const express = require("express");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Google OAuth2 Client
const CLIENT_ID =
  "896505141771-54k4pglsn8med4j2qmctvpps2pqdis08.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Middleware to verify Google token
async function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("Token required");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = payload; // Add user data to request
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

// Route to test authentication
app.get("/protected", authenticate, (req, res) => {
  res.send(`Hello ${req.user.name}, you have accessed a protected route!`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
