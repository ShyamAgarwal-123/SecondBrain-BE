import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  createdAt: Date;
}

const TagSchema: Schema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Tag = mongoose.model<ITag>("Tag", TagSchema);
export default Tag;
