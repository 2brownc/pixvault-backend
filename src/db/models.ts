import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../types";

// load env variables
dotenv.config();
const mongoURL = process.env.MONGODB_URI;

// connect to MongoDB
async function connectToDB(): Promise<void> {
  if (!mongoURL) {
    throw new Error("Missing MONGODB_URI; Cannot connect to database.");
  }

  await mongoose.connect(mongoURL);
}
(async () => await connectToDB())();

const userSchema = new mongoose.Schema<User>({
  name: String,
  history: [String],
  favorites: [String],
});

export const UserModel = mongoose.model("User", userSchema);
