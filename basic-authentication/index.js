import app from "./app.js";

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.status(401).send("Authentication Required");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const decode = Buffer.from(base64Credentials, "base64").toString();
  const [username, password] = decode.split(":");

  if (username === "admin" && password === "1234") {
    next();
  } else {
    res.status(401).send("Invalid credentials");
  }

};

app.get("/secure", basicAuth, (req, res) => {
  res.send("Welcome! You are authenticated");
});

app.listen("3000", () => {
  console.log("server is running on port 3000");
});
