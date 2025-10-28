import express from "express";
import { registerCompany } from "../controllers/companyCOntroller.js";
const router = express.Router();

router.post("/register", registerCompany);

export default router;
