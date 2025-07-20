import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'trial'; // Example statuses
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: 'User' }, // Assuming you have a User model
  plan: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, required: true, enum: ['active', 'cancelled', 'trial'], default: 'trial' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt field on save
SubscriptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
