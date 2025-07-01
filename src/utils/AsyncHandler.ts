import { NextFunction, Request, Response } from "express";
import { AsyncHandlerPropsType, NewRequestObjectType } from "../types";

export default function AsyncHandler(requestHandler: AsyncHandlerPropsType) {
  return (
    req: NewRequestObjectType,
    res: Response,
    next: NextFunction
  ): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
}
