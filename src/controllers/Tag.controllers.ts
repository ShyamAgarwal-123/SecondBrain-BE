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
    res.status(201).json(
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

export const getAllTags = AsyncHandler(async (req, res, next) => {
  try {
    const tags = await Tag.find({});

    if (!tags.length) {
      throw new ApiError({
        message: "No Tags",
        statusCode: 204,
      });
    }

    const data = tags.map((tag) => ({
      _id: tag._id,
      name: tag.name,
      createdAt: tag.createdAt,
    }));

    return res.status(200).json(
      new ApiResponse({
        message: "Successfully got the tags",
        statusCode: 200,
        data,
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const searchTags = AsyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new ApiError({
        message: "query parameter is Required",
        statusCode: 400,
      });
    }
    const tags = await Tag.find({ name: { $regex: q, $options: "i" } });
    const data = tags.map((tag) => ({
      _id: tag._id,
      name: tag.name,
      createdAt: tag.createdAt.toISOString(),
    }));
    return res.status(200).json(
      new ApiResponse({
        message: "Matching Tags Found",
        statusCode: 200,
        data,
      })
    );
  } catch (error) {
    ErrorResponse(error, res);
  }
});
