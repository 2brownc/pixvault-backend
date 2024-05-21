import { UserModel } from "./models";
import { type User, ImageId } from "../types";

export async function createUser(
  userId: string,
  userName: string
): Promise<boolean> {
  const user = new UserModel({
    userId: userId,
    name: userName,
    history: [],
    favorites: [],
  });

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ userId });
    if (existingUser) {
      throw new Error(`User already exists: ${userId}`);
    }

    // if user does not exist, create one
    await user.save();
    return true;
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

export async function getUserInfo(userId: string): Promise<User> {
  try {
    const user: User | null = await UserModel.findOne({ userId });

    if (user === null) {
      throw new Error(`User not found: ${userId}`);
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`);
  }
}
