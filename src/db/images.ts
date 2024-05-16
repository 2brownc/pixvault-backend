import e from "express"
import type { ImageRecord, ImageId } from "../types"
import { UserModel } from "./models"

export async function checkFavoriteImage(
	userId: string,
	imageId: string,
): Promise<boolean> {
	try {
		const user = await UserModel.findOne({ userId: userId })
		if (!user) {
			return false
		}
		return user.favorites.some((favorite) => favorite.id === imageId)
	} catch (err) {
		return false
	}
}

export async function setFavoriteImage(
	userId: string,
	imageRecord: ImageRecord,
): Promise<boolean> {
	const user = await UserModel.findOne({ userId: userId })

	if (user) {
		//check if the image is already faved
		const isFaved = await checkFavoriteImage(userId, imageRecord.id)
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
	userId: string,
	imageRecord: ImageRecord,
): Promise<boolean> {
	const user = await UserModel.findOne({ userId: userId })

	if (!user) {
		return false
	}

	try {
		// Check if the image already exists in the history
		const existingImage = user.history.find(
			(record) => record.id === imageRecord.id,
		)
		if (!existingImage) {
			user.history.push(imageRecord)
		}
		await user.save()
	} catch (error) {
		return false
	}

	return true
}

export async function unsetRecentImage(
	userId: string,
	imageRecord: ImageRecord,
): Promise<boolean> {
	const user = await UserModel.findOne({ userId: userId })

	if (!user) {
		return false
	}

	// Filter out the image with the matching ID from the history array
	user.history = user.history.filter(
		(record) => record.id.toString() !== imageRecord.id,
	)

	try {
		await user.save()
	} catch (error) {
		return false
	}

	return true
}

export async function deleteRecentHistory(userId: string): Promise<boolean> {
	const user = await UserModel.findOne({ userId: userId })
	if (!user) {
		return false
	}

	try {
		await UserModel.updateOne({ userId }, { $set: { history: [] } })
	} catch (error) {
		return false
	}

	return true
}

export async function getFavoriteImages(
	userId: string,
): Promise<ImageRecord[]> {
	const user = await UserModel.findOne({ userId: userId })

	if (!user) {
		throw new Error("User not found")
	}

	return user.favorites
}

export async function getRecentImages(
	userId: string,
): Promise<ImageRecord[] | null> {
	const user = await UserModel.findOne({ userId: userId })

	if (!user) {
		return null
	}

	return user.history
}

export async function unsetFavoriteImage(
	userId: string,
	imageId: ImageId,
): Promise<boolean> {
	const user = await UserModel.findOne({ userId: userId })

	if (!user) {
		return false
	}

	const updatedFavorites = user.favorites.filter(
		(image) => image.id !== imageId,
	)

	user.favorites = updatedFavorites

	try {
		await user.save()
		return true
	} catch (error) {
		return false
	}
}
