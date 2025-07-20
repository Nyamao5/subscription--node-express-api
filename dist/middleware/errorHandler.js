"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    console.error(err.stack); // Log the error stack for debugging
    var statusCode = err.statusCode || 500; // Use the error's status code if available, otherwise 500
    var message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        message: message,
        // Optionally, add more details in development mode
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map