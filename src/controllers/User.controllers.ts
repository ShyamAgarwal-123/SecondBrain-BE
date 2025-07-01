import ApiError from "api-error-ts";
import {
  signInUserSchema,
  signInUserSchemaZod,
  signUpUserSchema,
  signUpUserSchemaZod,
} from "../schemas/User.Schemas";
import AsyncHandler from "../utils/AsyncHandler";
import User, { IUser } from "../models/User.models";
import ApiResponse from "../utils/ApiResponse";

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
    return res.status(error.statusCode || error.http_code || 500).json(
      new ApiResponse({
        message: error.message,
        statusCode: error.statusCode || error.http_code || 500,
        path: error.path,
      })
    );
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
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    if (!accessToken && !refreshToken) {
      throw new ApiError({
        message: "Unable to generate tokens",
        statusCode: 500,
      });
    }

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
    res.status(error.statusCode || error.http_code || 500).json(
      new ApiResponse({
        message: error.message,
        statusCode: error.statusCode || error.http_code || 500,
      })
    );
  }
});
