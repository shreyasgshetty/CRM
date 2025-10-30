// server/controllers/employeeController.js
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// ➕ Add new Employee
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, department, companyId } = req.body;

    if (!name || !email || !password || !department || !companyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      email,
      password,
      department,
      companyId,
      role: "Employee",
      ticketsHandled: 0,
      status: "Active",
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Get all employees
export const getEmployees = async (req, res) => {
  try {
    const { companyId } = req.query;
    const employees = await Employee.find({ companyId });
    res.json(employees);
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};
