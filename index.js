const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const axios = require("axios");
const jwt = require("jsonwebtoken");
app.get("/api/linkedin/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/api/linkedin/callback",
        client_id: "86e9zn2jvrwlag",
        client_secret: "WPL_AP1.6d6Y9979FDXEl6We.q0UV4w==",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const idToken = tokenRes.data.id_token;
    const decoded = jwt.decode(idToken);
    const data = {
      linkedinId: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      profile: decoded.picture,
      method: "LinkedIn OpenID",
      status: "Connected",
      connectedAt: new Date(),
    }
    const payload = encodeURIComponent(JSON.stringify(data));
    res.redirect(`/heyreach?status=success&data=${payload}`);
  } catch (err) {
    console.log(err)
    res.redirect(`/heyreach?status=error`);
  }
});


app.get('/api', (req, res) => {
  res.send('Hello from the main server!');
});
app.use('/heyreach',express.static(path.join(__dirname, 'build')));

app.get('/^\/heyreach\/.*$/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}/heyreach`);
});
