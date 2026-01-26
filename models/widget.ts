import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWidget extends Document {
  companyId: mongoose.Types.ObjectId;
  widgetKey: string;
  name: string;
  brandColor: string;
  position: 'bottom-right' | 'bottom-left';
  welcomeMessage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WidgetSchema = new Schema<IWidget>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    widgetKey: {
      type: String,
      required: [true, 'Widget key is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Widget name is required'],
    },
    brandColor: {
      type: String,
      required: [true, 'Brand color is required'],
      default: '#3b82f6',
      validate: {
        validator: (v: string) => /^#([0-9A-F]{3}){1,2}$/i.test(v),
        message: 'Invalid color format. Use hex code.',
      },
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left'],
      default: 'bottom-right',
    },
    welcomeMessage: {
      type: String,
      required: [true, 'Welcome message is required'],
      trim: true,
      maxlength: [200, 'Welcome message cannot exceed 200 characters'],
      default: 'How can we help you today?',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WidgetSchema.index({ companyId: 1 });

const Widget: Model<IWidget> = 
  mongoose.models.Widget || mongoose.model<IWidget>('Widget', WidgetSchema);

export default Widget;