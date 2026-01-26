import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  websiteUrl: string;
  industry: string;
  companySize: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      required: [true, 'Company size is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company: Model<ICompany> = 
  mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;