import ApiError from "api-error-ts";
import { IUser } from "../models/User.models";

export function generateAccessToken(user: IUser) {
  const accessToken = user.generateAccessToken();
  if (!accessToken) {
    throw new ApiError({
      statusCode: 500,
      message: "Unable to Create the Access Token",
    });
  }
  return accessToken;
}

export async function generateRefreshToken(user: IUser) {
  const refreshToken = user.generateRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      message: "Unable to Create the Refresh Token",
      statusCode: 500,
    });
  }
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return refreshToken;
}
