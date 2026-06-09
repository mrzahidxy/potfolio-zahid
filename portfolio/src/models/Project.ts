import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a project document
export interface IProject extends Document {
  title: string;
  slug?: string;
  description: string;
  technology: string[];
  githubLink: string;
  liveLink?: string;
  img?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the project
const ProjectSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, index: true },
  description: { type: String, required: true },
  technology: { type: [String], required: true },
  githubLink: { type: String, required: true },
  liveLink: { type: String },
  img: { type: String },
  isArchived: { type: Boolean, default: false, index: true },
}, { timestamps: true });

// Export the model or use existing one to prevent multiple compilation errors
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
