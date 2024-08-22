import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from '../environment/environment';

export class JwtToken {
    static jwtSign(payload: UserPayload, expried_in: string = '180d') {
        return jwt.sign(payload, getEnvironmentVariable().jwt_secret_key, {
            expiresIn: expried_in
        });
    }

    static jwtVerify(token: string): Promise<any> {
        return new Promise((resolve, rejects) => {
            jwt.verify(token, getEnvironmentVariable().jwt_secret_key, (error, decode) => {
                if (error) {
                    rejects(error);
                } else if (!decode) {
                    const error = new Error("Unauthorization!");
                    (error as any).errorStatus = 401;
                    rejects(
                        error
                    )
                } else {
                    resolve(decode);
                }
            })
        })
    }
}