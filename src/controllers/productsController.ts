import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Product } from "../models/productModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(req.query, Product.find())
      .filter()
      .sort()
      .limit()
      .pagination();
    const products = await features.query;
    if (!products) return next(new AppError("can't find products", 404));
    res.status(200).json({
      status: "success",
      numProducts: products.length,
      data: {
        products,
      },
    });
  },
);

export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const features = new ApiFeatures(
      req.query,
      Product.find({ _id: id }),
    ).limit();
    const product = await features.query;
    if (!product)
      return next(new AppError("can't find product with that id: ", 404));
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);
