import User from "../models/User.js";
import Company from "../models/Company.js";
import bcrypt from "bcryptjs";

// Add new employee (Business Manager only)
export const addEmployee = async (req, res) => {
  try {
    console.log("🟢 Received employee data:", req.body); // ✅ Add this line

    const { name, email, password, designation, role, companyId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !designation || !role || !companyId) {
      console.log("⚠️ Missing field(s):", { name, email, password, designation, role, companyId });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employee
    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      designation,
      role,
      companyId,
      status: "active",
      type: "employee",
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


// Get all employees of a company
export const getEmployees = async (req, res) => {
  try {
    const { companyId } = req.query;
    const employees = await User.find({ companyId, type: "employee" });
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};
