import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export type ApiResponseReturnType = {
  statusCode: number;
  success: boolean;
  data: any | any[];
  message: string;
  path?: string;
};

export type AsyncHandlerPropsType = (
  req: NewRequestObjectType,
  res: Response,
  next: NextFunction
) => void;

export interface NewRequestObjectType extends Request {
  info: UserJwtPayload;
}

export interface UserJwtPayload extends JwtPayload {
  _id: "string";
}
