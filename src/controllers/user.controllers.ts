import { Request, Response, NextFunction } from "express"
import userModel from "../models/user.model";
import { Utils } from "../utils/utils";
import { NodeMailer } from "../utils/nodemailer";
import { JwtToken } from "../utils/jwt";

export class UserController {

    static async login(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const password = req.body.password;
        const user = await userModel.findOne({ email: email })
        try {
            if (!user) {
                const err = new Error('User not found. Please try again...');
                (err as any).errorStatus = 404;
                next(err);
            }
            const passwordHash: string = user.password as string;
            const data = {
                password, passwordHash
            }
            await Utils.comparePassword(data);
            const payload: UserPayload = {
                user_id: user.id,
                email: user.email,
                type: user.type
            }
            const token = JwtToken.jwtSign(payload);
            user.password = undefined;
            user.verification_token = undefined;
            user.verification_token_time = undefined;
            user.reset_password_token = undefined;
            user.reset_password_token_time = undefined;
            user.status = undefined;
            user.type = undefined;
            user.email_verified = undefined;
            return res.status(201).json({
                message: "Login user successfully!",
                status_code: 200,
                user,
                token
            })
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone;
        const name = req.body.name;
        const verification_token = Utils.generateVerificationToken(5)
        try {
            const passwordHash = await Utils.hashPassword(password);

            const exitUser = await userModel.findOne({
                email: email
            })
            if (exitUser) {
                const error = new Error('User already exit!');
                (error as any).errorStatus = 404;
                throw error;
            }

            await new userModel({
                email: email,
                password: passwordHash,
                name: name,
                phone: phone,
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
            }).save();
            await NodeMailer.sendMail({
                to: [email],
                subject: 'Email verification',
                html: `<h1> Your otp is ${verification_token}`
            })
            return res.status(200).json({
                message: `OTP is send to email ${email}!`,
                status_code: 200,
            })
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const verification_token = req.body.verification_token;
        try {
            const exitingUser = await userModel.findOne({ email: email });
            if (!exitingUser) {
                const error = new Error("User not found");
                (error as any).errorStatus = 404;
                throw error;
            }
            const user = await userModel.findOneAndUpdate(
                {
                    email: email,
                    verification_token: verification_token,
                    verification_token_time: { $gt: Date.now() }
                },
                {
                    $set: {
                        status: 'active',
                        email_verified: true
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
                {
                    returnDocument: 'after',
                    projection: {
                        password: 0,
                        status: 0,
                        verification_token: 0,
                        verification_token_time: 0,
                        email_verified: 0
                    }
                }
            ).exec();
            if (user) {
                const payload = {
                    user_id: user.id,
                    email: user.email,
                    type: user.type
                }
                const token = JwtToken.jwtSign(payload);

                return res.status(201).json({
                    message: "Register user successfully!",
                    status_code: 201,
                    user,
                    token
                })
            } else {
                throw new Error("Email Verification Token Is Wrong Or Email Verification Token Is Expired. Please try again...")
            }
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async resendOtp(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const verification_token = Utils.generateVerificationToken(5);
        try {
            const user = await userModel.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    $set: {
                        verification_token: verification_token,
                        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                    },
                },
                {
                    returnDocument: 'after',
                    projection: {
                        password: 0,
                        status: 0,
                        verification_token: 0,
                        verification_token_time: 0,
                        email_verified: 0
                    }
                }
            ).exec();
            if (user) {
                await NodeMailer.sendMail({
                    to: [email],
                    subject: 'Email verification',
                    html: `<h1> Your otp is ${verification_token}`
                })
                return res.status(201).json({
                    message: `OTP is sent to email ${email}`,
                    status_code: 200,
                })
            } else {
                const err = new Error('User not found. Please try again...');
                (err as any).errorStatus = 404;
                throw err
            }
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async sendOtpForgotPassword(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const reset_password_token = Utils.generateVerificationToken(5);
        try {
            const exitingUser = await userModel.findOne({ email: email });
            if (!exitingUser) {
                const error = new Error("User not found");
                (error as any).errorStatus = 404;
                throw error;
            }
            const user = await userModel.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    $set: {
                        reset_password_token: reset_password_token,
                        reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
            ).exec();
            if (user) {
                await NodeMailer.sendMail({
                    to: [email],
                    subject: 'Reset password verification',
                    html: `<h1> Your otp is ${reset_password_token}`
                })
                return res.status(200).json({
                    message: `OTP is send to email ${email}!`,
                    status_code: 200,
                })
            } else {
                throw new Error("Reset Password Token Is Wrong Or Reset Password Token Is Expired. Please try again...")
            }
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async verifyForgotPassword(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const reset_password_token = req.body.reset_password_token;
        const password_reset = req.body.password_reset;
        const password_reset_confirm = req.body.password_reset_confirm;
        try {
            const exitingUser = await userModel.findOne({ email: email });
            if (!exitingUser) {
                const error = new Error("User not found");
                (error as any).errorStatus = 404;
                throw error;
            }
            if (password_reset != password_reset_confirm) {
                throw new Error('Password reset and password reset confirm don\'t match!')
            }
            const passwordResetHash = await Utils.hashPassword(password_reset);
            const user = await userModel.findOneAndUpdate(
                {
                    email: email,
                    reset_password_token: reset_password_token,
                    reset_password_token_time: { $gt: Date.now() }
                },
                {
                    $set: {
                        password: passwordResetHash
                    },
                    $currentDate: {
                        updated_at: true
                    }
                },
            ).exec();
            if (user) {
                return res.status(200).json({
                    message: `Reset password successfully!`,
                    status_code: 200,
                })
            } else {
                throw new Error("Reset Password Token Is Wrong Or Reset Password Token Is Expired. Please try again...")
            }
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async resendOtpForgotPass(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const reset_pass_token = Utils.generateVerificationToken(5);
        try {
            const user = await userModel.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    $set: {
                        reset_password_token: reset_pass_token,
                        reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                    },
                },
                {
                    returnDocument: 'after',
                    projection: {
                        password: 0,
                        status: 0,
                        verification_token: 0,
                        verification_token_time: 0,
                        email_verified: 0
                    }
                }
            ).exec();
            if (user) {
                await NodeMailer.sendMail({
                    to: [email],
                    subject: 'Reset password verification',
                    html: `<h1> Your otp is ${reset_pass_token}`
                })
                return res.status(201).json({
                    message: `OTP is sent to email ${email}`,
                    status_code: 200,
                })
            } else {
                const err = new Error('User not found. Please try again...');
                (err as any).errorStatus = 404;
                throw err
            }
        } catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async profile(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        try {
            const profie = await userModel.findById(user.user_id).select("-password -verification_token -email_verified -verification_token_time -reset_password_token -reset_password_token_time");
            return res.status(200).json({
                message: 'Get profile successfully',
                status_code: 200,
                user: profie
            })
        }
        catch (e) {
            next(e);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        const name = req.body.name;
        const phone = req.body.phone;
        try {
            const profie = await userModel.findByIdAndUpdate(user.user_id, {
                $set: {
                    name: name,
                    phone: phone
                },
            },
                {
                    returnDocument: 'after',
                    projection: {
                        password: 0,
                        status: 0,
                        verification_token: 0,
                        verification_token_time: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        email_verified: 0
                    }
                })
            return res.status(200).json({
                message: 'Update profile successfully',
                status_code: 200,
                user: profie
            })
        }
        catch (e) {
            next(e);
        }
    }
}