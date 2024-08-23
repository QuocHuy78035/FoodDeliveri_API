import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { JwtToken } from "../utils/jwt";

export class GlobalMiddleware {
    static handleValidationError(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(422).json({
            //     error: error.array().map(e => e.msg)
            // })
            const err = new Error(errors.array()[0].msg);
            (err as any).errorStatus = 422;
            return next(err);
        }
        next();
    }

    static async auth(req: Request, res: Response, next: NextFunction) {
        const headerAuth = req.headers.authorization;
        const token = headerAuth ? headerAuth.slice(7, headerAuth.length) : null;
        try {
            if (!token) {
                const error = new Error('Unauthorization Error');
                (error as any).errorStatus = 401;
                next(error);
            }
            const decode = await JwtToken.jwtVerify(token) as UserPayload;
            req.user = decode;
            next();
        } catch (err) {
            const error = new Error('Invaild token');
            (error as any).errorStatus = 401;
            next(error);
        }
    }

    static async adminRole(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        if (user.type !== "admin") {
            const error = new Error('Forbidden Error');
            (error as any).errorStatus = 403;
            next(error);
        }
        next();
    }
}