import express, { Express, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createUser, getUserInfo } from "./db/account"
import {
  setFavoriteImage,
  setRecentImage,
  getFavoriteImages,
  unsetFavoriteImage,
  getRecentImages,
} from "./db/images"
import {
  getImages,
  getLandingPageImages,
  getRelatedImages,
  getImagesInfo,
} from "./api/images"
import type { Image, SearchConfig, User, ImageId, ImageRecord } from "./types"
import { verifyAuth0Token } from "./auth/auth0"
import { verifyAnonToken } from "./auth/anon"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

/*
const appOrigin = authConfig.appOrigin || `http://localhost:${port}`;
app.use(cors({ origin: appOrigin }));
*/

// enable cors
app.use(cors({ origin: process.env.CORS_ORIGIN_SERVER }))

// to parse JSON request bodies
app.use(express.json())

app.get(
  "/welcomeimages",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const images: Image[] = await getLandingPageImages()

    let container = `
    <div style="
    #imageGrid {
      column-count: 3;
      column-gap: 1rem;
    }
    
    #imageGrid > div {
      margin-bottom: 1rem;
      break-inside: avoid;
    }
    
    #imageGrid img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    ">
  `

    images.forEach(image => {
      container += `
      <div>
        <div><img src="${image.thumbnail}" /></div>
        <div><a href="${image.foreign_landing_url}">GO TO PAGE</a></div>
      </tr>
    `
    })

    container += `</div>`

    res.statusCode = 200
    res.send(images)
  },
)

app.post(
  "/search/keyword/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const searchConfig: SearchConfig = {
      q: req.body.keyword,
      page: req.body.page ? parseInt(req.body.page) : 1,
    }
    const images: Image[] = await getImages(searchConfig)

    res.statusCode = 200
    res.send(images)
  },
)

app.post(
  "/search/tag/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const searchConfig: SearchConfig = {
      tags: req.body.tag,
      page: req.body.page ? parseInt(req.body.page) : 1,
    }
    const images: Image[] = await getImages(searchConfig)

    res.statusCode = 200
    res.send(images)
  },
)

app.post(
  "/search/related/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const identifier: string = req.body.identifier
    const images: Image[] = await getRelatedImages(identifier)

    res.statusCode = 200
    res.send(images)
  },
)

app.post(
  "/createUser",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    await createUser(req.body.user as string)

    res.statusCode = 200
    res.send("User created")
  },
)

app.post(
  "/userProfile",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    const userInfo: User | null = await getUserInfo(req.body.user as string)
    res.statusCode = 200
    if (userInfo === null) {
      res.statusCode = 404
      res.send("User not found")
    } else {
      res.send(userInfo)
    }
  },
)

app.post(
  "/setFavoriteImage",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    console.log("set fav req body: ", req.body)
    const userId: string = req.body.userId
    const imageRecord: ImageRecord = req.body.imageRecord
    const result = await setFavoriteImage(userId, imageRecord)

    if (result) {
      res.statusCode = 200
      res.send("Image added to favorites.")
    } else {
      res.statusCode = 400
      res.send("User does not exist.")
    }
  },
)

app.post(
  "/setRecentImage",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    const imageRecord: ImageRecord = req.body.imageRecord
    await setRecentImage(req.body.user as string, imageRecord)

    res.statusCode = 200
    res.send("Image added to history")
  },
)

app.post(
  "getSavedImages",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    const imageRecords: ImageRecord[] | null = await getRecentImages(
      req.body.user as string,
    )

    //if there are no recent images
    if (imageRecords === null) {
      res.statusCode = 200
      res.send("No recent images found")
      return
    }
    const imageIds = imageRecords.map(imageRecord => imageRecord.id)
    const images: Image[] = await getImagesInfo(imageIds)

    res.statusCode = 200
    res.send(images)
  },
)

app.post(
  "/getFavoriteImages",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    const imageRecords: ImageRecord[] = await getFavoriteImages(
      req.body.user as string,
    )
    const imageIds = imageRecords.map(imageRecord => imageRecord.id)
    const images: Image[] = await getImagesInfo(imageIds)

    res.statusCode = 200
    res.send(images)
  },
)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

app.post(
  "/unsetFavoriteImage",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    const userId: string = req.body.userId
    const imageId: ImageId = req.body.imageId

    try {
      const result = await unsetFavoriteImage(userId, imageId)
      res.statusCode = 200
      res.send("Image removed from favorites.")
    } catch (error) {
      res.statusCode = 501
      res.send(error)
    }
  },
)
