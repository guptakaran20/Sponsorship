"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, message, data = null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    static ok(message, data = null) {
        return new ApiResponse(true, message, data);
    }
    static error(message) {
        return new ApiResponse(false, message, null);
    }
}
exports.ApiResponse = ApiResponse;
