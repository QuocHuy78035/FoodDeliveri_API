import * as bycrypt from 'bcrypt';
import * as multer from 'multer';

const storagesOptions = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/' + file.fieldname)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

export class Utils {

    public MAX_TOKEN_TIME = 5 * 60 * 1000;
    public multer = multer({
        storage: storagesOptions,
        fileFilter: fileFilter,
        //limits: { fileSize: 1024 * 1024 * 2 } // 2MB limit
    });

    static generateVerificationToken(digit: number = 6) {
        let otp: string = '';
        for (var i = 0; i < digit; i++) {
            otp += Math.floor(Math.random() * 10)
        }
        return otp;
    }

    static hashPassword(password: string) {
        return new Promise((resolve, rejects) => {
            bycrypt.hash(password, 10, (err, passwordHash) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(passwordHash);
                }
            })
        });
    }

    static comparePassword(data: { password: string, passwordHash: string }) {
        return new Promise((resolve, rejects) => {
            bycrypt.compare(data.password, data.passwordHash, (err, same) => {
                if (err) {
                    rejects(err);
                } else if (!same) {
                    const err = new Error('User & Password doesn\'t Match!');
                    (err as any).errorStatus = 400;
                    rejects(err)
                }

                else {
                    resolve(true);
                }
            })
        });
    }
}