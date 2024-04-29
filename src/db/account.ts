import { UserModel } from "./models"
import { type User, ImageId } from "../types"

export async function createUser(userId: string, userName: string) {
  const user = new UserModel({
    userId: userId,
    name: userName,
    history: [],
    favorites: [],
  })

  await user.save()
}

export async function getUserInfo(userId: string): Promise<User | null> {
  const user = await UserModel.findOne({ userId })

  if (user === null) {
    return null
  }

  return user as User
}
