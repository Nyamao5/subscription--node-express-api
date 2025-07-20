"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authorize = function (requiredRoles) {
    return function (req, res, next) {
        var _a;
        var user = req.user; // Assuming req.user is populated by your authentication middleware
        if (!user) {
            // This case should ideally not happen if authMiddleware is used before
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        // Assuming user.customClaims contains the roles or permissions
        var userRoles = ((_a = user.customClaims) === null || _a === void 0 ? void 0 : _a.roles) || []; // Adjust based on your custom claims structure
        var hasPermission = requiredRoles.some(function (role) { return userRoles.includes(role); });
        if (hasPermission) {
            next(); // User has the required role, proceed
        }
        else {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
    };
};
exports.default = authorize;
//# sourceMappingURL=authorizeMiddleware.js.map