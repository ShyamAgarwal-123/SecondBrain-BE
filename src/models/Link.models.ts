import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  url: string;
  description: string;
  tags: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LinkSchema: Schema = new Schema<ILink>({
  url: { type: String, required: true },
  description: { type: String },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Link = mongoose.model<ILink>("Link", LinkSchema);

export default Link;
