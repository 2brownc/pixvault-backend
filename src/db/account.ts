import { User } from "./models";

export async function createUser(username: string) {
  const user = new User({
    name: username,
    history: [],
    favorites: [],
  });

  await user.save();
}

async function getUserInfo(username: string) {
  const user = await User.findOne({ name: username });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
