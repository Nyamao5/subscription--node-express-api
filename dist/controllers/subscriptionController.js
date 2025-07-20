"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.cancelSubscription = exports.updateSubscription = exports.getSubscriptionsByUserId = exports.getSubscriptionById = exports.createSubscription = void 0;
var Subscription_1 = __importDefault(require("../models/Subscription"));
// Create a new subscription
var createSubscription = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newSubscriptionData, newSubscription, savedSubscription, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                newSubscriptionData = __assign(__assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid });
                newSubscription = new Subscription_1.default(newSubscriptionData);
                return [4 /*yield*/, newSubscription.save()];
            case 1:
                savedSubscription = _b.sent();
                res.status(201).json(savedSubscription);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(400).json({ message: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSubscription = createSubscription;
// Get a subscription by ID
var getSubscriptionById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Subscription_1.default.findOne({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid })];
            case 1:
                subscription = _b.sent();
                if (!subscription) {
                    return [2 /*return*/, res.status(404).json({ message: 'Subscription not found or you do not have permission' })];
                }
                res.json(subscription);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(500).json({ message: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSubscriptionById = getSubscriptionById;
// Get all subscriptions for a user
var getSubscriptionsByUserId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subscriptions, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Subscription_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid })];
            case 1:
                subscriptions = _b.sent();
                res.json(subscriptions);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(500).json({ message: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSubscriptionsByUserId = getSubscriptionsByUserId;
// Update a subscription
var updateSubscription = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedSubscription, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Subscription_1.default.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid }, req.body, { new: true })];
            case 1:
                updatedSubscription = _b.sent();
                if (!updatedSubscription) {
                    return [2 /*return*/, res.status(404).json({ message: 'Subscription not found or you do not have permission' })];
                }
                res.json(updatedSubscription);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(400).json({ message: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateSubscription = updateSubscription;
// Cancel a subscription (example: setting status to cancelled)
var cancelSubscription = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cancelledSubscription, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Subscription_1.default.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid }, { status: 'cancelled' }, { new: true })];
            case 1:
                cancelledSubscription = _b.sent();
                if (!cancelledSubscription) {
                    return [2 /*return*/, res.status(404).json({ message: 'Subscription not found or you do not have permission' })];
                }
                res.json(cancelledSubscription);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                res.status(400).json({ message: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.cancelSubscription = cancelSubscription;
//# sourceMappingURL=subscriptionController.js.map