"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        res.status(err.statusCode).json(ApiResponse_1.ApiResponse.error(err.message));
        return;
    }
    logger_1.logger.error(err);
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json(ApiResponse_1.ApiResponse.error(isDev ? err.message : 'Internal server error'));
};
exports.errorHandler = errorHandler;
