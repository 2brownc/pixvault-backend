import e from "express"
import { ImageRecord, ImageId } from "../types"
import { UserModel } from "./models"

export async function checkFavoriteImage(
  username: string,
  imageId: string,
): Promise<boolean> {
  try {
    const user = await UserModel.findOne({ name: username })
    if (!user) {
      return false
    }
    return user.favorites.some(favorite => favorite.id === imageId)
  } catch (err) {
    return false
  }
}

export async function setFavoriteImage(
  username: string,
  imageRecord: ImageRecord,
): Promise<boolean> {
  const user = await UserModel.findOne({ name: username })

  if (user) {
    //check if the image is already faved
    const isFaved = await checkFavoriteImage(username, imageRecord.id)
    if (isFaved) {
      return true
    }

    // if not already faved then fav it
    user.favorites.push(imageRecord)
    try {
      await user.save()
      return true
    } catch (error) {
      return false
    }
  } else {
    // user does not exist, operation failed
    return false
  }
}

export async function setRecentImage(
  username: string,
  imageRecord: ImageRecord,
): Promise<boolean> {
  const user = await UserModel.findOne({ name: username })

  if (!user) {
    return false
  }

  user.history.push(imageRecord)
  try {
    await user.save()
  } catch (error) {
    return false
  }

  return true
}

export async function getFavoriteImages(
  username: string,
): Promise<ImageRecord[]> {
  const user = await UserModel.findOne({ name: username })

  if (!user) {
    throw new Error("User not found")
  }

  return user.favorites
}

export async function getRecentImages(
  username: string,
): Promise<ImageRecord[] | null> {
  const user = await UserModel.findOne({ name: username })

  if (!user) {
    return null
  }

  return user.history
}

export async function unsetFavoriteImage(
  userId: string,
  imageId: ImageId,
): Promise<boolean> {
  const user = await UserModel.findOne({ name: userId })

  if (!user) {
    return false
  }

  const updatedFavorites = user.favorites.filter(image => image.id !== imageId)

  user.favorites = updatedFavorites

  try {
    await user.save()
    return true
  } catch (error) {
    return false
  }
}
