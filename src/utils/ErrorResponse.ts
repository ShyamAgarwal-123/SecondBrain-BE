import { Response } from "express";
import ApiResponse from "./ApiResponse";

const ErrorResponse = (error: any, res: Response) => {
  return res.status(error.statusCode || error.http_code || 500).json(
    new ApiResponse({
      message: error.message,
      statusCode: error.statusCode || error.http_code || 500,
      path: error.path,
    })
  );
};

export default ErrorResponse;
