import express from "express";
import { loginUser, registerUser, loginBusinessManager} from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login-business", loginBusinessManager);


export default router;
