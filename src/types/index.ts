import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    info?: UserJwtPayload;
  }
}

export type ApiResponseReturnType = {
  statusCode: number;
  success: boolean;
  data: any | any[];
  message: string;
  path?: string;
};

export type AsyncHandlerPropsType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// export interface NewRequestObjectType extends Request {
//   info: UserJwtPayload;
// }

export interface UserJwtPayload extends JwtPayload {
  _id: string;
}
