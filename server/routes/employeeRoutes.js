import express from "express";
import { addEmployee, getEmployees } from "../controllers/employeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add new employee (Business Manager only)
router.post("/", verifyToken, addEmployee);

// 📋 Get all employees (optional — for listing)
router.get("/", verifyToken, getEmployees);

export default router;
