"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
var app = (0, express_1.default)();
// MongoDB Connection
var mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MONGODB_URI is not defined in your .env file.');
    process.exit(1);
}
mongoose_1.default.connect(mongoURI)
    .then(function () { return console.log('MongoDB connected'); })
    .catch(function (err) { return console.error('MongoDB connection error:', err); });
app.get('/', function (req, res) {
    var name = process.env.NAME || 'World';
    res.send("Hello ".concat(name, "!"));
});
var port = parseInt(process.env.PORT || '3000');
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
//# sourceMappingURL=index.js.map