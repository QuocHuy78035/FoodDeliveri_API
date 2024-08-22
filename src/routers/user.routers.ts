import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { UserValidators } from "../validations/user.validation";
import { GlobalMiddleware } from "../middlewares/global.middleware";

class UserRouter {
    public router: Router

    constructor() {
        this.router = Router()
        this.postRouter();
        this.getRouter();
        this.patchRouter();
        this.deleteRouter();
    }

    postRouter() {
        this.router.post(
            '/register',
            UserValidators.register(),
            GlobalMiddleware.handleValidationError,
            UserController.register)
        this.router.post(
            '/resend-otp',
            UserValidators.checkFieldEmail(),
            GlobalMiddleware.handleValidationError,
            UserController.resendOtp)
        this.router.post(
            '/resend-otp-forgot-password',
            UserValidators.checkFieldEmail(),
            GlobalMiddleware.handleValidationError,
            UserController.resendOtpForgotPass)
        this.router.post(
            '/login',
            UserValidators.login(),
            GlobalMiddleware.handleValidationError,
            UserController.login)
        this.router.post(
            '/forgot-password',
            UserValidators.checkFieldEmail(),
            GlobalMiddleware.handleValidationError,
            UserController.sendOtpForgotPassword)
    };
    getRouter() {
        this.router.get(
            '/profile',
            GlobalMiddleware.auth,
            UserController.profile
        )
    };
    patchRouter() {
        this.router.patch(
            '/verify',
            UserValidators.verify(),
            GlobalMiddleware.handleValidationError,
            UserController.verifyEmail)
        this.router.patch(
            '/reset-password',
            UserValidators.verifyResetPassword(),
            GlobalMiddleware.handleValidationError,
            UserController.verifyForgotPassword)
        this.router.patch(
            '/profile',
            GlobalMiddleware.auth,
            UserValidators.checkFieldPhone(),
            UserController.updateProfile
        )
    };
    deleteRouter() { };
}

export default new UserRouter().router;