import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for a User document
export interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
}

// Define the schema for the User
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

// Export the model or use an existing one to prevent recompilation errors
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
