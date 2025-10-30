import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee", "Support", "BusinessManager"], // ✅ Added "Support"
      default: "Employee",
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // ✅ made lowercase
      default: "active",
    },
    type: {
      type: String,
      enum: ["employee", "company", "admin"], // ✅ as per your logic
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
