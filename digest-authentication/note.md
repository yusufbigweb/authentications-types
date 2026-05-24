#Degist-Authentication

``` import express from "express";
import crypto from "crypto";

const app = express();


//user credentual
const USER = "admin";
const PASS = "password";
const REALM = "test";
const NONCE = "12345";


function md5(data) {
  return crypto.createHash("md5").update(data).digest("hex");
}


app.get("/secure", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.setHeader(
      "WWW-Authenticate",
      `Digest realm="${REALM}", qop="auth", nonce="${NONCE}", opaque="67890"`
    );
    return res.status(401).send("Auth required");
  }

  // 🔥 Parse header
  const values = Object.fromEntries(
    auth
      .replace("Digest ", "")
      .split(", ")
      .map(v => v.split("="))
      .map(([k, v]) => [k, v.replace(/"/g, "")])
  );

  const { username, uri, nonce, nc, cnonce, qop, response } = values;

  // 🔐 Create expected hash
  const HA1 = md5(`${USER}:${REALM}:${PASS}`);
  const HA2 = md5(`GET:${uri}`);
  const expected = md5(`${HA1}:${nonce}:${nc}:${cnonce}:${qop}:${HA2}`);

  console.log("Client Response:", response);
  console.log("Expected:", expected);

  if (response === expected) {
    return res.send("✅ AUTH SUCCESS 🔐");
  } else {
    return res.status(401).send("❌ AUTH FAILED");
  }
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});```