import ApiError from "api-error-ts";
import jwt from "jsonwebtoken";
import {
  signInUserSchema,
  signInUserSchemaZod,
  signUpUserSchema,
  signUpUserSchemaZod,
} from "../schemas/User.Schemas";
import AsyncHandler from "../utils/AsyncHandler";
import User, { IUser } from "../models/User.models";
import ApiResponse from "../utils/ApiResponse";
import { UserJwtPayload } from "../types";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/GenerateTokens";
import ErrorResponse from "../utils/ErrorResponse";
import Link from "../models/Link.models";

export const signup = AsyncHandler(async (req, res, next) => {
  try {
    const { username, email, password }: signUpUserSchema = req.body;
    const validatedInput = signUpUserSchemaZod.safeParse({
      username,
      email,
      password,
    });
    if (!validatedInput.success) {
      throw new ApiError({
        message: validatedInput.error?.issues?.[0].message,
        statusCode: 400,
        path: validatedInput.error?.issues?.[0].path?.[0] as string,
      });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError({
        message: "User with this email already exist",
        statusCode: 409,
      });
    }

    const newUser = await User.create<signUpUserSchema>({
      username,
      email,
      password,
    });
    if (!newUser) {
      throw new ApiError({
        message: "Unable To Signup User",
        statusCode: 501,
      });
    }

    return res.status(201).json(
      new ApiResponse({
        message: "User successfully signup",
        statusCode: 201,
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const signin = AsyncHandler(async (req, res, next) => {
  try {
    const { email, password }: signInUserSchema = req.body;
    const verifiedInput = signInUserSchemaZod.safeParse({
      email,
      password,
    });

    if (!verifiedInput.success) {
      throw new ApiError({
        message: verifiedInput.error.issues[0].message,
        statusCode: 400,
        path: verifiedInput.error.issues?.[0].path?.[0] as string,
      });
    }
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      throw new ApiError({
        message: "No Such User found Please signup",
        statusCode: 400,
      });
    }

    const isVerified = await user.isPasswordCorrect(password);
    if (!isVerified) {
      throw new ApiError({
        message: "Incorrect Password",
        statusCode: 400,
      });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 10 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          data: user,
          message: "User Signin Successfully",
        })
      );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const refreshAccessToken = AsyncHandler(async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
      throw new ApiError({
        message: "Refresh Token Required",
        statusCode: 403,
      });
    }
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as UserJwtPayload;
    } catch (error) {
      throw new ApiError({ statusCode: 401, message: "Invalid Refresh Token" });
    }
    const user = await User.findById(verifiedToken._id);
    if (
      !user ||
      !user.refreshToken ||
      user.refreshToken !== incomingRefreshToken
    ) {
      throw new ApiError({
        message: "Invalid Refresh Token or User Logged out",
        statusCode: 401,
      });
    }
    const accessToken = generateAccessToken(user);
    return res
      .cookie("accessToken", accessToken, {
        maxAge: 10 * 60 * 1000,
      })
      .status(200)
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "Access Token is Successfully Refreshed",
        })
      );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const getUser = AsyncHandler(async (req, res, next) => {
  try {
    const _id = req.info?._id;

    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError({
        message: "No Such User found Please signup",
        statusCode: 400,
      });
    }
    const link = await Link.findOne({ userID: _id });

    let hash;
    if (!link) {
      hash = "";
    } else {
      hash = link.hash;
    }
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          username: user.username,
          email: user.email,
          hash,
        },
        message: "Successfully got User",
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});
