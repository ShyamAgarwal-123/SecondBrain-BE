import ApiError from "api-error-ts";
import {
  ContentSchemaType,
  contentSchemaZod,
} from "../schemas/Contents.Schemas";
import AsyncHandler from "../utils/AsyncHandler";
import Content from "../models/Content.models";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse";

export const uploadContent = AsyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.info;
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
    const content = await Content.create({
      title,
      link,
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
    return res
      .json(
        new ApiResponse({
          message: error.message,
          statusCode: error.statusCode || error.http_code || 500,
        })
      )
      .status(error.statusCode || error.http_code || 500);
  }
});
