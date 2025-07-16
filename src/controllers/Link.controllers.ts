import ApiError from "api-error-ts";
import crypto from "crypto";
import AsyncHandler from "../utils/AsyncHandler";
import ApiResponse from "../utils/ApiResponse";
import Link from "../models/Link.models";
import ErrorResponse from "../utils/ErrorResponse";

export const share = AsyncHandler(async (req, res, next) => {
  try {
    const { share } = req.body;

    const _id = req.info?._id;

    if (share) {
      let link;
      link = await Link.findOne({ userID: _id }).select("hash");
      if (link) {
        return res.status(200).json(
          new ApiResponse({
            message: "link already exist",
            data: link.hash,
            statusCode: 200,
          })
        );
      }

      const hash = crypto.randomBytes(32).toString("hex");
      if (!hash) {
        throw new ApiError({
          message: "Unable to generate unique token",
          statusCode: 500,
        });
      }
      link = await Link.create({
        hash,
        userID: _id,
      });
      if (!link) {
        throw new ApiError({
          message: "Unable to create a shareable link",
          statusCode: 500,
        });
      }

      return res.status(200).json(
        new ApiResponse({
          message: "successfully created a link",
          statusCode: 200,
          data: link.hash,
        })
      );
    }
    const link = await Link.findOneAndDelete({ userID: _id });
    if (!link) {
      throw new ApiError({
        message: "No link found",
        statusCode: 404,
      });
    }
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "Successfuly remove the link",
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});

export const getBrain = AsyncHandler(async (req, res, next) => {
  try {
    const { shareLink: hash } = req.params;
    if (!hash) {
      throw new ApiError({
        message: "share link is required",
        statusCode: 400,
      });
    }
    const data = await Link.aggregate([
      {
        $match: { hash },
      },
      {
        $lookup: {
          foreignField: "_id",
          localField: "userID",
          as: "user",
          from: "users",
          pipeline: [
            {
              $project: {
                username: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          foreignField: "userID",
          localField: "userID",
          as: "content",
          from: "contents",
          pipeline: [
            {
              $lookup: {
                localField: "tags",
                foreignField: "_id",
                from: "tags",
                as: "tags",
                pipeline: [
                  {
                    $project: {
                      __v: 0,
                      createdAt: 0,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: { username: { $arrayElemAt: ["$user.username", 0] } },
      },
      {
        $project: {
          username: 1,
          content: 1,
          _id: 0,
        },
      },
    ]);

    if (!data.length) {
      throw new ApiError({
        message: "Invalid link",
        statusCode: 404,
      });
    }
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: data[0],
        message: "Successfly Shared the content",
      })
    );
  } catch (error: any) {
    ErrorResponse(error, res);
  }
});
