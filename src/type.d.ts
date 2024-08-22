declare namespace Express {
    export interface Request {
        user: UserPayload
    }
}

interface UserPayload {
    email: string
    user_id: string
    type: string
}
