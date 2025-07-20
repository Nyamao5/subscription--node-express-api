import { Request, Response } from 'express';
import Subscription, { ISubscription } from '../models/Subscription';
import * as admin from 'firebase-admin';

// Extend the Request object to include the Firebase user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// Create a new subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    // Ensure userId is set to the authenticated user's UID
    const newSubscriptionData = { ...req.body, userId: req.user?.uid };
    const newSubscription: ISubscription = new Subscription(newSubscriptionData as any);
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get a subscription by ID
export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, userId: req.user?.uid });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found or you do not have permission' });
    }
    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subscriptions for a user
export const getSubscriptionsByUserId = async (req: Request, res: Response) => {
  try {
    // Ensure only fetching subscriptions for the authenticated user
    const subscriptions = await Subscription.find({ userId: req.user?.uid });
    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subscription
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    // Find and update only if the subscription belongs to the authenticated user
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.uid },
      req.body,
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found or you do not have permission' });
    }
    res.json(updatedSubscription);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel a subscription (example: setting status to cancelled)
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    // Find and cancel only if the subscription belongs to the authenticated user
    const cancelledSubscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.uid },
      { status: 'cancelled' },
      { new: true }
    );
    if (!cancelledSubscription) {
      return res.status(404).json({ message: 'Subscription not found or you do not have permission' });
    }
    res.json(cancelledSubscription);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
