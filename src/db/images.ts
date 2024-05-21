import e from "express";
import type { ImageRecord, ImageId } from "../types";
import { UserModel } from "./models";

export async function checkFavoriteImage(
  userId: string,
  imageId: string
): Promise<boolean> {
  try {
    const user = await UserModel.findOne({ userId: userId });
    if (!user) {
      return false;
    }
    return user.favorites.some((favorite) => favorite.id === imageId);
  } catch (err) {
    return false;
  }
}

export async function setFavoriteImage(
  userId: string,
  imageRecord: ImageRecord
) {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    //check if the image is already faved
    const isFaved = await checkFavoriteImage(userId, imageRecord.id);
    if (isFaved) {
      return true;
    }

    // if not already faved then fav it
    user.favorites.push(imageRecord);
    await user.save();
  } catch (error) {
    throw new Error(`failed to set favorite image: ${error}`);
  }
}

export async function setRecentImage(userId: string, imageRecord: ImageRecord) {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }
    // Check if the image already exists in the history
    const existingImage = user.history.find(
      (record) => record.id === imageRecord.id
    );

    if (existingImage) {
      throw new Error(`Image already exists in history: ${imageRecord.id}`);
    }

    user.history.push(imageRecord);
    await user.save();
  } catch (error) {
    throw new Error(`failed to set recent image: ${error}`);
  }
}

export async function unsetRecentImage(
  userId: string,
  imageRecord: ImageRecord
) {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    user.history = user.history.filter(
      (record) => record.id.toString() !== imageRecord.id
    );

    await user.save();
  } catch (error) {
    return false;
  }
}

export async function deleteRecentHistory(userId: string) {
  try {
    const user = await UserModel.findOne({ userId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    await UserModel.updateOne({ userId }, { $set: { history: [] } });
  } catch (error) {
    throw new Error(`failed to delete recent image history: ${error}`);
  }
}

export async function getFavoriteImages(
  userId: string
): Promise<ImageRecord[]> {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to get fav images: ${error}`);
  }
}

export async function getRecentImages(userId: string): Promise<ImageRecord[]> {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return user.history;
  } catch (error) {
    throw new Error(`failed to get recent images: ${error}`);
  }
}

export async function unsetFavoriteImage(userId: string, imageId: ImageId) {
  try {
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedFavorites = user.favorites.filter(
      (image) => image.id !== imageId
    );

    user.favorites = updatedFavorites;
    await user.save();
  } catch (error) {
    throw new Error(`failed to unset favorite image: ${error}`);
  }
}
