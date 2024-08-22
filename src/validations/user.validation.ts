import { checkSchema } from 'express-validator';

export class UserValidators {

    static login() {
        return checkSchema({
            email: {
                notEmpty: {
                    errorMessage: "Email is required"
                },
                isEmail: {
                    errorMessage: 'Invalid email'
                }
            },
            password: {
                notEmpty: {
                    errorMessage: "Password is required"
                },
            },
        });
    }

    static register() {
        return checkSchema({
            email: {
                notEmpty: {
                    errorMessage: "Email is required"
                },
                isEmail: {
                    errorMessage: 'Invalid email'
                }
            },
            name: {
                notEmpty: {
                    errorMessage: "Name is required"
                },
                isString: {
                    errorMessage: "Name must be a string"
                }
            },
            phone: {
                notEmpty: {
                    errorMessage: "Phone number is required"
                },
                isLength: {
                    errorMessage: "Phone number must have 10 characters",
                    options: {
                        min: 10,
                        max: 10
                    }
                }
            },
            password: {
                notEmpty: {
                    errorMessage: "Password is required"
                },
                isLength: {
                    options: { min: 8 },
                    errorMessage: 'Password should be at least 8 chars',
                },
            },
        });
    }

    static verify() {
        return checkSchema({
            email: {
                notEmpty: {
                    errorMessage: "Email is required"
                },
                isEmail: {
                    errorMessage: 'Invalid email'
                }
            },
            verification_token: {
                notEmpty: {
                    errorMessage: "Verification token is required"
                },
            },
        }, ['body'])
    }

    static checkFieldEmail() {
        return checkSchema({
            email: {
                notEmpty: {
                    errorMessage: "Email is required"
                },
                isEmail: {
                    errorMessage: 'Invalid email'
                }
            },
        }, ['body'])
    }

    static checkFieldPhone() {
        return checkSchema({
            phone: {
                notEmpty: {
                    errorMessage: "Phone number is required"
                },
                isLength: {
                    errorMessage: "Phone number must have 10 characters",
                    options: {
                        min: 10,
                        max: 10
                    }
                }
            },
        }, ['body'])
    }

    static verifyResetPassword() {
        return checkSchema({
            email: {
                notEmpty: {
                    errorMessage: "Email is required"
                },
                isEmail: {
                    errorMessage: 'Invalid email'
                }
            },
            reset_password_token: {
                notEmpty: {
                    errorMessage: "Reset password token is required"
                },
            },
            password_reset: {
                notEmpty: {
                    errorMessage: "Password reset is required"
                },
                isLength: {
                    options: { min: 8 },
                    errorMessage: 'Password reset should be at least 8 chars',
                },
            },
            password_reset_confirm: {
                notEmpty: {
                    errorMessage: "Password reset confirm is required"
                },
                isLength: {
                    options: { min: 8 },
                    errorMessage: 'Password reset confirm should be at least 8 chars',
                },
            }
        }, ['body'])
    }
}
