"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var subscriptionController_1 = require("../controllers/subscriptionController");
var authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
var authorizeMiddleware_1 = __importDefault(require("../middleware/authorizeMiddleware")); // Import the authorize middleware
var subscriptionValidation_1 = require("../validation/subscriptionValidation");
var router = (0, express_1.Router)();
// Validation middleware handler
var handleValidationErrors = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
// Apply authentication middleware to subscription routes
router.use(authMiddleware_1.default);
// Define Subscription Routes with validation and sanitization
router.post('/', subscriptionValidation_1.createSubscriptionValidation, 
// Add sanitization
(0, express_validator_1.body)('plan').trim().escape(), (0, express_validator_1.body)('startDate').toDate(), (0, express_validator_1.body)('endDate').optional().toDate(), (0, express_validator_1.body)('status').trim().escape(), handleValidationErrors, subscriptionController_1.createSubscription);
router.get('/:id', subscriptionValidation_1.getSubscriptionByIdValidation, handleValidationErrors, subscriptionController_1.getSubscriptionById);
router.get('/user/:userId', 
// Note: We are relying on Firebase auth middleware to validate user existence
// but you might want to add format validation for userId if needed.
subscriptionController_1.getSubscriptionsByUserId);
router.put('/:id', subscriptionValidation_1.updateSubscriptionValidation, 
// Add sanitization
(0, express_validator_1.body)('plan').optional().trim().escape(), (0, express_validator_1.body)('startDate').optional().toDate(), (0, express_validator_1.body)('endDate').optional().toDate(), (0, express_validator_1.body)('status').optional().trim().escape(), handleValidationErrors, subscriptionController_1.updateSubscription);
router.put('/cancel/:id', (0, authorizeMiddleware_1.default)(['admin']), // Example: Only allow users with 'admin' role to cancel
subscriptionValidation_1.cancelSubscriptionValidation, handleValidationErrors, subscriptionController_1.cancelSubscription);
exports.default = router;
//# sourceMappingURL=subscriptionRoutes.js.map