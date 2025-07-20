import { Router } from 'express';
import { validationResult, body, param } from 'express-validator';
import { createSubscription, getSubscriptionById, getSubscriptionsByUserId, updateSubscription, cancelSubscription } from '../controllers/subscriptionController';
import authMiddleware from '../middleware/authMiddleware';
import authorize from '../middleware/authorizeMiddleware'; // Import the authorize middleware
import { createSubscriptionValidation, updateSubscriptionValidation, getSubscriptionByIdValidation, cancelSubscriptionValidation } from '../validation/subscriptionValidation';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Validation middleware handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply authentication middleware to subscription routes
router.use(authMiddleware);

// Define Subscription Routes with validation and sanitization
router.post(
  '/',
  createSubscriptionValidation,
  // Add sanitization
  body('plan').trim().escape(),
  body('startDate').toDate(),
  body('endDate').optional().toDate(),
  body('status').trim().escape(),
  handleValidationErrors,
  createSubscription
);

router.get(
  '/:id',
  getSubscriptionByIdValidation,
  handleValidationErrors,
  getSubscriptionById
);

router.get(
  '/user/:userId',
  // Note: We are relying on Firebase auth middleware to validate user existence
  // but you might want to add format validation for userId if needed.
  getSubscriptionsByUserId
);

router.put(
  '/:id',
  updateSubscriptionValidation,
  // Add sanitization
  body('plan').optional().trim().escape(),
  body('startDate').optional().toDate(),
  body('endDate').optional().toDate(),
  body('status').optional().trim().escape(),
  handleValidationErrors,
  updateSubscription
);

router.put(
  '/cancel/:id',
  authorize(['admin']), // Example: Only allow users with 'admin' role to cancel
  cancelSubscriptionValidation,
  handleValidationErrors,
  cancelSubscription
);

export default router;
