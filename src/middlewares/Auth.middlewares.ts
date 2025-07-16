import ApiError from "api-error-ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserJwtPayload } from "../types";
import ApiResponse from "../utils/ApiResponse";
import ErrorResponse from "../utils/ErrorResponse";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
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
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      );
    } catch (error) {
      throw new ApiError({
        message: "Invalid Access Token",
        statusCode: 401,
      });
    }
    req.info = verifiedToken as UserJwtPayload;
    next();
  } catch (error: any) {
    ErrorResponse(error, res);
  }
};
