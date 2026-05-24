import { md5 } from "../utils/hash.js";

const USER = "admin";
const PASS = "password";
const REALM = "test";
const NONCE = "12345";

export const secureRoute = (req, res) => {
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

//MD5-sess FIX
const HA1_base = md5(`${USER}:${REALM}:${PASS}`);
const HA1 = md5(`${HA1_base}:${nonce}:${cnonce}`);

const HA2 = md5(`GET:${uri}`);

const expected = md5(`${HA1}:${nonce}:${nc}:${cnonce}:${qop}:${HA2}`);

  console.log("Client:", response);
  console.log("Server:", expected);

  if (response === expected) {
    return res.send("AUTH SUCCESS");
  } else {
    return res.status(401).send("❌ AUTH FAILED");
  }
};