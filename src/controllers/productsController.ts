import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Product } from "../models/productModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { ApiCRUD } from "../utils/ApiCRUD";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(req.query, Product.find())
      .filter()
      .sort()
      .limit()
      .pagination();
    const products = await features.query;
    if (!products.length) return next(new AppError("can't find products", 404));
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
    if (!product.length)
      return next(new AppError("can't find product with that id: ", 404));
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new AppError("can't find product with that id:", 404));
    const deleteFeature = new ApiCRUD(req.body, Product, id);
    const product = await deleteFeature.delete();
    if (!product)
      return next(new AppError("can't find product with specified ID", 404));
    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, currency, category, stock } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      currency,
      category,
      stock,
    });
    if (!product)
      return next(new AppError("can't upload product ", 404));
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);
