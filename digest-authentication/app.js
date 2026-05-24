import express from "express";
const apps = express();

// router 
import authRouter from "./routers/auth.routes.js";

apps.use("/api", authRouter)

export { apps };