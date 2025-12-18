import { Schema, model, models } from "mongoose";

const companySchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  websiteUrl: { 
    type: String, 
    default: ""  // Add default value
  },
  industry: { 
    type: String, 
    default: ""  // Add default value
  },
  companySize: { 
    type: String, 
    required: true  // Make sure this is required
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true  // This adds createdAt and updatedAt
});

const Company = models.Company || model("Company", companySchema);
export default Company;