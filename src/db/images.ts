import { ImageRecord } from "../types";
import { UserModel } from "./models";

export async function setFavoriteImage(
  username: string,
  imageRecord: ImageRecord,
) {
  const user = await UserModel.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  user.favorites.push(imageRecord);
  await user.save();
}

export async function setRecentImage(
  username: string,
  imageRecord: ImageRecord,
) {
  const user = await UserModel.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  user.history.push(imageRecord);
  await user.save();
}

export async function getFavoriteImages(
  username: string,
): Promise<ImageRecord[]> {
  const user = await UserModel.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  return user.favorites;
}

export async function getRecentImages(
  username: string,
): Promise<ImageRecord[]> {
  const user = await UserModel.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  return user.history;
}
