// server/routes/employeeRoutes.js
import express from "express";
import { addEmployee, getEmployees } from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addEmployee);
router.get("/", verifyToken, getEmployees);

export default router;
