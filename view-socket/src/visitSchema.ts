import { Schema, model, models, InferSchemaType } from "mongoose";

const visitSchema = new Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

type VisitDoc = InferSchemaType<typeof visitSchema>;

export default models.Visit || model<VisitDoc>("Visit", visitSchema);
