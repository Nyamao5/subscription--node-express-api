"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var admin = __importStar(require("firebase-admin"));
var subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
var errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var winston_1 = __importDefault(require("winston"));
var http_1 = __importDefault(require("http")); // Import http module
dotenv_1.default.config();
var app = (0, express_1.default)();
// **Logging and Monitoring**
var logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
app.use((0, morgan_1.default)('combined', { stream: { write: function (message) { return logger.info(message.trim()); } } }));
app.locals.logger = logger;
// **Security Enhancements**
app.use((0, helmet_1.default)());
var corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
};
app.use((0, cors_1.default)(corsOptions));
var apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Initialize Firebase Admin SDK
var firebaseServiceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!firebaseServiceAccountKeyPath) {
    logger.error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not defined in your .env file.');
    process.exit(1);
}
try {
    var serviceAccount = require(firebaseServiceAccountKeyPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    logger.info('Firebase Admin SDK initialized');
}
catch (error) {
    logger.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
}
// MongoDB Connection
var mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    logger.error('MONGODB_URI is not defined in your .env file.');
    process.exit(1);
}
mongoose_1.default.connect(mongoURI)
    .then(function () { return logger.info('MongoDB connected'); })
    .catch(function (err) { return logger.error('MongoDB connection error:', err); });
// Use Subscription Routes
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.get('/', function (req, res) {
    var name = process.env.NAME || 'World';
    res.send("Hello ".concat(name, "!"));
});
// Add the error handling middleware as the last middleware
app.use(errorHandler_1.default);
var port = parseInt(process.env.PORT || '3000');
// Create a Node.js HTTP server
var server = http_1.default.createServer(app);
server.listen(port, function () {
    logger.info("listening on port ".concat(port));
});
// **Graceful Shutdown**
var gracefulShutdown = function () {
    logger.info('Received termination signal. Starting graceful shutdown.');
    // Stop the server from accepting new connections
    server.close(function (err) { return __awaiter(void 0, void 0, void 0, function () {
        var dbErr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        logger.error('Error during server shutdown:', err);
                        process.exit(1);
                    }
                    logger.info('HTTP server closed.');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 2:
                    _a.sent();
                    logger.info('MongoDB connection closed.');
                    return [3 /*break*/, 4];
                case 3:
                    dbErr_1 = _a.sent();
                    logger.error('Error during MongoDB disconnection:', dbErr_1);
                    return [3 /*break*/, 4];
                case 4:
                    // Add other resource cleanup here (e.g., closing file handles, other connections)
                    logger.info('Graceful shutdown complete. Exiting process.');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    }); });
    // Optional: Forceful shutdown after a timeout
    setTimeout(function () {
        logger.error('Graceful shutdown timeout. Forcing exit.');
        process.exit(1);
    }, process.env.SHUTDOWN_TIMEOUT ? parseInt(process.env.SHUTDOWN_TIMEOUT) : 10000); // Default timeout of 10 seconds
};
// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
//# sourceMappingURL=index.js.map