const express = require('express');
const app = express();
require("dotenv").config();
const path = require('path');
const PORT = 3000;
const axios = require("axios");
const jwt = require("jsonwebtoken");

app.get("/api/linkedin/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REACT_APP_REDIRECT_URL,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const tokenData = tokenRes.data
    const idToken = tokenRes.data.id_token;
    const decoded = jwt.decode(idToken);
    if (state == "infinite"){
      const data = {
        linkedinId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        profile: decoded.picture,
        access_token: tokenData.access_token,
        access_token_exp: tokenData.expires_in,
        refresh_token: tokenData.refresh_token,
        refresh_token_exp: tokenData.refresh_token_expires_in,
        token_issued_at : Date.now()
      }
      const payload = encodeURIComponent(JSON.stringify(data));
      res.redirect(`/heyreach?status=success&data=${payload}`);
    }else{
      const data = {
          linkedinId: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          profile: decoded.picture,
          access_token: tokenData.access_token,
          access_token_exp: tokenData.expires_in,
          token_issued_at : Date.now()
        }
      const payload = encodeURIComponent(JSON.stringify(data));
      res.redirect(`/heyreach?status=success&data=${payload}`);
    }

  } catch (err) {
    res.redirect(`/heyreach?status=error`);
  }
});
app.post("/api/linkedin/refresh", express.json(), async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const {
      access_token,
      expires_in,
      refresh_token: new_refresh_token,
      refresh_token_expires_in,
    } = response.data;

    res.json({
      access_token,
      access_token_exp: expires_in,
      refresh_token: new_refresh_token || refresh_token,
      refresh_token_exp: refresh_token_expires_in,
    });
  } catch (error) {
    res.status(401).json({ error: "REFRESH_FAILED" });
  }
});

app.get('/api', (req, res) => {
  res.send('Hello from the main server!');
});
app.use('/heyreach', express.static(path.join(__dirname, 'build')));

app.get('/^\/heyreach\/.*$/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}/heyreach`);
});
