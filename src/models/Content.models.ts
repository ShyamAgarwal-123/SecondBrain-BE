import mongoose, { Schema, Document } from "mongoose";

enum ContentTypes {
  DOCUMENT = "document",
  TWEET = "tweet",
  YOUTUBE = "youtube",
  LINK = "link",
}

export interface IContent extends Document {
  title: string;
  link: string;
  type: ContentTypes;
  userID: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ContentSchema: Schema = new Schema<IContent>({
  title: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ContentTypes, required: true },
  link: { type: String, required: true },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.model<IContent>("Content", ContentSchema);

export default Content;
