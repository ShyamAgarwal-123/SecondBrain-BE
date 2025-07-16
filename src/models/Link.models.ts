import mongoose, { Schema, Document } from "mongoose";

export interface ILink extends Document {
  hash: string;
  userID: Schema.Types.ObjectId;
  createdAt: Date;
}

const LinkSchema: Schema = new Schema<ILink>({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Link = mongoose.model<ILink>("Link", LinkSchema);

export default Link;
