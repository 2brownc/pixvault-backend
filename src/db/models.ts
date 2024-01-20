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

  try {
    await mongoose.connect(mongoURL);
  } catch (err) {
    throw new Error(`Can't connect to mongoDB: ${err}`);
  }
}
(async () => await connectToDB())();

const userSchema = new mongoose.Schema<User>({
  name: String,
  history: [String],
  favorites: [String],
});

export const UserModel = mongoose.model("User", userSchema);
