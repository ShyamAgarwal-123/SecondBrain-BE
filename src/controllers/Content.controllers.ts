import ApiError from "api-error-ts";
import {
  ContentSchemaType,
  contentSchemaZod,
} from "../schemas/Contents.Schemas";
import AsyncHandler from "../utils/AsyncHandler";
import Content from "../models/Content.models";

import ApiResponse from "../utils/ApiResponse";
import ErrorResponse from "../utils/ErrorResponse";

export const uploadContent = AsyncHandler(async (req, res, next) => {
  try {
    const _id = req.info?._id;
    const { type, link, title, tags }: ContentSchemaType = req.body;
    const verifiedInput = contentSchemaZod.safeParse({
      title,
      link,
      type,
      tags,
    });
    if (!verifiedInput.success) {
      throw new ApiError({
        message: verifiedInput.error.issues?.[0].message,
        statusCode: 400,
        path: verifiedInput.error.issues?.[0].path?.[0] as string,
      });
    }
    let updatedLink;
    switch (type) {
      case "tweet":
        updatedLink = link.replace("x.com", "twitter.com");
        break;
      case "youtube":
        updatedLink = link.replace("youtu.be", "www.youtube.com/embed");
        break;
      default:
        updatedLink = link;
        break;
    }
    const content = await Content.create({
      title,
      link: updatedLink,
      type,
      tags,
      userID: _id,
    });

    if (!content) {
      throw new ApiError({
        message: "Unable to upload content in db",
        statusCode: 500,
      });
    }
    const polulatedContent = await content.populate({
      path: "tags",
      select: "name",
    });
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        data: polulatedContent,
        message: "Content Created Successfully",
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const getAllContents = AsyncHandler(async (req, res, next) => {
  try {
    const _id = req.info?._id;
    const contents = await Content.find({ userID: _id }).select("-__v");
    if (!contents.length) {
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "No Content",
        })
      );
    }
    let populatedContent = await Promise.all(
      contents.map((content) => {
        return content.populate({ path: "tags", select: "name" });
      })
    );
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: populatedContent,
        message: "Successfully get all the contents",
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const deleteContent = AsyncHandler(async (req, res, next) => {
  try {
    const _id = req.info?._id;
    const { contentId } = req.params;
    if (!contentId) {
      throw new ApiError({
        message: "Content id is required",
        statusCode: 400,
      });
    }
    const deletedContent = await Content.findOneAndDelete({
      _id: contentId,
      userID: _id,
    });
    if (!deletedContent) {
      throw new ApiError({
        message: "No Content Exist",
        statusCode: 404,
      });
    }
    return res
      .json(
        new ApiResponse({
          statusCode: 204,
          message: "Successfully deleted the content",
        })
      )
      .status(204);
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});
