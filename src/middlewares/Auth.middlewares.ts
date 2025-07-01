import ApiError, { ApiErrorOptions } from "api-error-ts";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { NewRequestObjectType, UserJwtPayload } from "../types";
import ApiResponse from "../utils/ApiResponse";

export const Auth = (
  req: NewRequestObjectType,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer", "");
    if (!token) {
      throw new ApiError({
        statusCode: 403,
        message: "Access Token Required",
      });
    }
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );
    req.info = verifiedToken as UserJwtPayload;
    next();
  } catch (error: any) {
    res
      .json(
        new ApiResponse({
          statusCode: error.statusCode || error.http_code || 500,
          message: error.message,
        })
      )
      .status(error.statusCode || error.http_code || 500);
  }
};
