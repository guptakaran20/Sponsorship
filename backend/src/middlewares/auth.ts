import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../utils/ApiResponse';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateRequest = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json(ApiResponse.error('No token provided, authorization denied'));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json(ApiResponse.error('Token is not valid'));
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json(ApiResponse.error('Access denied: insufficient permissions'));
        }
        next();
    };
};
