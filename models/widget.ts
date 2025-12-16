import mongoose from "mongoose";

const WidgetSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    brandColor: { type: String, default: "#000000" },
    position: { type: String, enum: ["bottom-right", "bottom-left"], default: "bottom-right" },
    welcomeMessage: { type: String, default: "Hi! How can I help you today?" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Widget || mongoose.model("Widget", WidgetSchema);
