import { body, param } from 'express-validator';

export const createSubscriptionValidation = [
  body('plan').notEmpty().withMessage('Plan is required').isString().withMessage('Plan must be a string'),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().toDate().withMessage('Invalid start date format (use ISO 8601)'),
  body('endDate').optional().isISO8601().toDate().withMessage('Invalid end date format (use ISO 8601)'),
  body('status').optional().isIn(['active', 'cancelled', 'trial']).withMessage('Invalid status'),
];

export const updateSubscriptionValidation = [
  param('id').isMongoId().withMessage('Invalid subscription ID'),
  body('plan').optional().isString().withMessage('Plan must be a string'),
  body('startDate').optional().isISO8601().toDate().withMessage('Invalid start date format (use ISO 8601)'),
  body('endDate').optional().isISO8601().toDate().withMessage('Invalid end date format (use ISO 8601)'),
  body('status').optional().isIn(['active', 'cancelled', 'trial']).withMessage('Invalid status'),
];

export const getSubscriptionByIdValidation = [
  param('id').isMongoId().withMessage('Invalid subscription ID'),
];

export const cancelSubscriptionValidation = [
  param('id').isMongoId().withMessage('Invalid subscription ID'),
];
