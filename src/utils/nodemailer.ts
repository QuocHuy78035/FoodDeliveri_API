import * as nodeMailer from 'nodemailer';
import { getEnvironmentVariable } from '../environment/environment';

export class NodeMailer {

    private static initialTransport() {
        return nodeMailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: getEnvironmentVariable().gmail_auth.user,
                pass: getEnvironmentVariable().gmail_auth.pass,
            },
        });
    }

    static sendMail(data: { to: [string], subject: string, html: string }): Promise<any> {
        return NodeMailer.initialTransport().sendMail({
            from: getEnvironmentVariable().gmail_auth.user,
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    }
}