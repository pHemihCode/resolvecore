import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string | null;
  email: string;
  image: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    image: String,
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;