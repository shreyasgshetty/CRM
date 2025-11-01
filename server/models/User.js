import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: {
      type: String,
      enum: ["Technical", "Support", "Sales"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee", "Support", "BusinessManager"],
      default: "Employee",
    },
    ticketsHandled: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
