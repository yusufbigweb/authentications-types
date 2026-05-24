import express from "express"
import { secureRoute } from "../controllers/auth.controller.js"

const router = express.Router()

router.get("/secure", secureRoute); 


export default router