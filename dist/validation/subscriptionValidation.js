"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscriptionValidation = exports.getSubscriptionByIdValidation = exports.updateSubscriptionValidation = exports.createSubscriptionValidation = void 0;
var express_validator_1 = require("express-validator");
exports.createSubscriptionValidation = [
    (0, express_validator_1.body)('plan').notEmpty().withMessage('Plan is required').isString().withMessage('Plan must be a string'),
    (0, express_validator_1.body)('startDate').notEmpty().withMessage('Start date is required').isISO8601().toDate().withMessage('Invalid start date format (use ISO 8601)'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().toDate().withMessage('Invalid end date format (use ISO 8601)'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'cancelled', 'trial']).withMessage('Invalid status'),
];
exports.updateSubscriptionValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid subscription ID'),
    (0, express_validator_1.body)('plan').optional().isString().withMessage('Plan must be a string'),
    (0, express_validator_1.body)('startDate').optional().isISO8601().toDate().withMessage('Invalid start date format (use ISO 8601)'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().toDate().withMessage('Invalid end date format (use ISO 8601)'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'cancelled', 'trial']).withMessage('Invalid status'),
];
exports.getSubscriptionByIdValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid subscription ID'),
];
exports.cancelSubscriptionValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid subscription ID'),
];
//# sourceMappingURL=subscriptionValidation.js.map