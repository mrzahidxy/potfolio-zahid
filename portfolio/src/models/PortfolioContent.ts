import mongoose, { Document, Model, Schema } from "mongoose";
import type { ProfileContent } from "@/lib/profile-types";

export interface IPortfolioContent extends Document, ProfileContent {
  key: string;
}

const PortfolioContentSchema: Schema<IPortfolioContent> = new Schema(
  {
    key: { type: String, required: true, unique: true },
    personal_details: { type: Schema.Types.Mixed, required: true },
    preferences: { type: Schema.Types.Mixed, required: true },
    history: { type: Schema.Types.Mixed, required: true },
    metadata: { type: Schema.Types.Mixed, required: true },
    content: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  }
);

const PortfolioContent: Model<IPortfolioContent> =
  mongoose.models.PortfolioContent ||
  mongoose.model<IPortfolioContent>("PortfolioContent", PortfolioContentSchema);

export default PortfolioContent;
