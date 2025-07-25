import ApiError from "api-error-ts";
import AsyncHandler from "../utils/AsyncHandler";
import Tag from "../models/Tag.models";
import ApiResponse from "../utils/ApiResponse";
import ErrorResponse from "../utils/ErrorResponse";

export const createTag = AsyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name && typeof name !== "string") {
      throw new ApiError({
        message: "tag name is required",
        statusCode: 400,
      });
    }
    const tag = await Tag.create({
      name,
    });
    if (!tag) {
      throw new ApiError({
        message: "Unable to create a tag",
        statusCode: 500,
      });
    }
    res.json(
      new ApiResponse({
        message: "Tag created Successfully",
        statusCode: 201,
        data: tag,
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});
