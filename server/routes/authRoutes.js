import express from "express";
import { loginUser, registerUser, loginBusinessManager} from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginBusinessManager);


export default router;
