import { Request, Response, NextFunction } from "express";
import bannerModel from "../models/banner.model";

export class BannerController {

    static async addBanner(req: Request, res: Response, next: NextFunction) {
        try {
            const path = `http://localhost:3000/src/uploads/bannerImages/` + req.file.filename;
            const banner = await new bannerModel({
                banner: path
            }).save();
            return res.status(201).json({
                message: 'Upload banner successfully!',
                status_code: 201,
                banner
            })
        }
        catch (e) {
            console.log(e);
            return next(e);
        }
    }

    static async getAllBanner(req: Request, res: Response, next: NextFunction) {
        const banners = await bannerModel.find({
            status: 1
        });
        return res.status(200).json({
            message: 'Get all banner successfully!',
            status_code: 200,
            banners
        })
    }
}