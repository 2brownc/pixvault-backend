import { UserModel } from "./models";
import { User } from "../types";

export async function createUser(username: string) {
  const user = new UserModel({
    name: username,
    history: [],
    favorites: [],
  });

  await user.save();
}

export async function getUserInfo(username: string): Promise<User> {
  const user = await UserModel.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  return user as User;
}
