import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  customerEmail: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
