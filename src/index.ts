import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, getUserInfo } from "./db/account";
import {
  setFavoriteImage,
  setRecentImage,
  getFavoriteImages,
  unsetFavoriteImage,
  getRecentImages,
  unsetRecentImage,
  deleteRecentHistory,
} from "./db/images";
import {
  getImages,
  getLandingPageImages,
  getRelatedImages,
  getImagesInfo,
} from "./api/images";
import type { Image, SearchConfig, User, ImageId, ImageRecord } from "./types";
import { verifyAuth0Token } from "./auth/auth0";
import { verifyAnonToken } from "./auth/anon";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

/*
const appOrigin = authConfig.appOrigin || `http://localhost:${port}`;
app.use(cors({ origin: appOrigin }));
*/

// enable cors
app.use(cors({ origin: process.env.CORS_ORIGIN_SERVER }));

// to parse JSON request bodies
app.use(express.json());

/*
 this is a backend server
 so no direct interaction is allowed
 there is no "GET /"
*/

// for testing purpose; protected
app.get(
  "/welcomeimages",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    try {
      const images: Image[] = await getLandingPageImages();

      // if no images are received
      if (!images) {
        res.statusCode = 500;
        res.send("Can't get images");
        return;
      }

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
  `;

      images.map((image) => {
        container += `
      <div>
        <div><img src="${image.thumbnail}" /></div>
        <div><a href="${image.foreign_landing_url}">GO TO PAGE</a></div>
      </tr>
    `;
      });

      container += "</div>";

      res.statusCode = 200;
      res.send(images);

      return;
    } catch (error) {
      res.statusCode = 500;
      res.send(`Can't get images: ${error}`);
    }

    res.statusCode = 404;
    res.send("no images found");
  }
);

app.post(
  "/search/keyword/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const searchConfig: SearchConfig = {
      q: req.body.q,
      page: req.body.page ? Number.parseInt(req.body.page) : 1,
    };
    try {
      const images: Image[] = await getImages(searchConfig);
      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`Can't get images by keyword: ${error}`);
    }
  }
);

app.post(
  "/search/tag/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const searchConfig: SearchConfig = {
      tags: req.body.q,
      page: req.body.page ? Number.parseInt(req.body.page) : 1,
    };

    try {
      const images: Image[] = await getImages(searchConfig);
      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`Can't get images by tag: ${error}`);
    }
  }
);

app.post(
  "/search/related/",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    const identifier: string = req.body.identifier;

    try {
      const images: Image[] = await getRelatedImages(identifier);
      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`Can't get related images: ${error}`);
    }
  }
);

app.post(
  "/createUser",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;
      const userName: string = req.body.imageRecord;

      await createUser(userId, userName);

      res.statusCode = 200;
      res.send("User created");
    } catch (error) {
      res.statusCode = 500;
      res.send(`Create user error: ${error}`);
    }
  }
);

app.post(
  "/userProfile",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userInfo: User = await getUserInfo(req.body.userId as string);

      res.statusCode = 200;
      res.send(userInfo);
    } catch (error) {
      res.statusCode = 500;
      res.send(`Get user error: ${error}`);
    }
  }
);

app.post(
  "/setFavoriteImage",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;
      const imageRecord: ImageRecord = req.body.imageRecord;

      await setFavoriteImage(userId, imageRecord);
      res.statusCode = 200;
      res.send("Image added to favorites");
    } catch (error) {
      res.statusCode = 500;
      res.send(`Favorite image error: ${error}`);
    }
  }
);

app.post(
  "/images/setRecent",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;
      const imageRecord: ImageRecord = req.body.imageRecord;

      await setRecentImage(userId, imageRecord);
      res.statusCode = 200;
      res.send("Image added to history");
    } catch (error) {
      res.statusCode = 500;
      res.send(`Set recent image error: ${error}`);
    }
  }
);

app.post(
  "/images/unsetRecent",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;
      const imageRecord: ImageRecord = req.body.imageRecord;

      await unsetRecentImage(userId, imageRecord);

      res.statusCode = 200;
      res.send("Image removed from history");
    } catch (error) {
      res.statusCode = 500;
      res.send(`Unset recent image error: ${error}`);
    }
  }
);

app.post(
  "/images/deleteAllRecentHistory",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;

      await deleteRecentHistory(userId);

      res.statusCode = 200;
      res.send("Image history deleted");
    } catch (error) {
      res.statusCode = 500;
      res.send(`Clear recent image history error: ${error}`);
      return;
    }
  }
);

app.post(
  "/getRecentImages",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const imageRecords: ImageRecord[] = await getRecentImages(
        req.body.user as string
      );

      const imageIds = imageRecords.map((imageRecord) => imageRecord.id);
      const images: Image[] = await getImagesInfo(imageIds);

      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`Get recent images error: ${error}`);
    }
  }
);

app.post(
  "/getFavoriteImages",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const imageRecords: ImageRecord[] = await getFavoriteImages(
        req.body.userId as string
      );
      const imageIds = imageRecords.map((imageRecord) => imageRecord.id);
      const images: Image[] = await getImagesInfo(imageIds);

      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`get fav images error: ${error}`);
    }
  }
);

app.post(
  "/images/getIdListInfo",
  verifyAnonToken,
  async (req: Request, res: Response) => {
    try {
      const imageIds = req.body.images as ImageId[];
      const images: Image[] = await getImagesInfo(imageIds);

      res.statusCode = 200;
      res.send(images);
    } catch (error) {
      res.statusCode = 500;
      res.send(`get image id list info: ${error}`);
    }
  }
);

app.post(
  "/unsetFavoriteImage",
  verifyAuth0Token,
  async (req: Request, res: Response) => {
    try {
      const userId: string = req.body.userId;
      const imageId: ImageId = req.body.imageId;

      await unsetFavoriteImage(userId, imageId);
      res.statusCode = 200;
      res.send("Image removed from favorites.");
    } catch (error) {
      res.statusCode = 501;
      res.send(error);
    }
  }
);

app.listen(port, () => {
  console.info(`[server]: Server is running at http://localhost:${port}`);
});
