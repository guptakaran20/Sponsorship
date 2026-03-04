"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateRequest = void 0;
const jwt_1 = require("../utils/jwt");
const ApiResponse_1 = require("../utils/ApiResponse");
const authenticateRequest = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        return res.status(401).json(ApiResponse_1.ApiResponse.error('No token provided, authorization denied'));
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json(ApiResponse_1.ApiResponse.error('Token is not valid'));
    }
};
exports.authenticateRequest = authenticateRequest;
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json(ApiResponse_1.ApiResponse.error('Access denied: insufficient permissions'));
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
