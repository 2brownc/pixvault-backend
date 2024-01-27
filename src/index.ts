import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, getUserInfo } from "./db/account";
import {
  getImages,
  getLandingPageImages,
  getRelatedImages,
} from "./api/images";
import { authConfig } from "./authConfig";
import { auth } from "express-oauth2-jwt-bearer";
import type { Image, SearchConfig, User } from "./types";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

/*
const appOrigin = authConfig.appOrigin || `http://localhost:${port}`;
app.use(cors({ origin: appOrigin }));
*/

// enable cors
app.use(cors({ origin: process.env.CORS_ORIGIN_SERVER }));

/* Auth0 tokecn checking as middleware*/
const jwtCheck = auth(authConfig);
app.use(jwtCheck);

// to parse JSON request bodies
app.use(express.json());

app.get("/welcomeimages", async (req: Request, res: Response) => {
  const images: Image[] = await getLandingPageImages();

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

  images.forEach((image) => {
    container += `
      <div>
        <div><img src="${image.thumbnail}" /></div>
        <div><a href="${image.foreign_landing_url}">GO TO PAGE</a></div>
      </tr>
    `;
  });

  container += `</div>`;

  res.statusCode = 200;
  res.send(images);
});

app.post("/search/keyword/", async (req: Request, res: Response) => {
  const searchConfig: SearchConfig = {
    q: req.body.keyword,
    page: req.body.page ? parseInt(req.body.page) : 1,
  };
  const images: Image[] = await getImages(searchConfig);

  res.statusCode = 200;
  res.send(images);
});

app.post("/search/tag/", async (req: Request, res: Response) => {
  const searchConfig: SearchConfig = {
    tags: req.body.tag,
    page: req.body.page ? parseInt(req.body.page) : 1,
  };
  const images: Image[] = await getImages(searchConfig);

  res.statusCode = 200;
  res.send(images);
});

app.post("/search/related/", async (req: Request, res: Response) => {
  const identifier: string = req.body.identifier;
  const images: Image[] = await getRelatedImages(identifier);

  res.statusCode = 200;
  res.send(images);
});

app.post("/createUser", async (req: Request, res: Response) => {
  await createUser(req.body.user as string);

  res.statusCode = 200;
  res.send("User created");
});

app.post("/userProfile", async (req: Request, res: Response) => {
  const userInfo: User = await getUserInfo(req.body.user as string);

  res.statusCode = 200;
  res.send(userInfo);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
