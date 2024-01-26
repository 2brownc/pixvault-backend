import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { verifyToken } from "./auth/account";
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

/* Auth0 tokecn checking as middleware*/
const jwtCheck = auth(authConfig);
app.use(jwtCheck);

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

app.get("/search/keyword/:keyword/:page", async (req: Request, res) => {
  const searchConfig: SearchConfig = {
    q: req.params.keyword,
    page: req.params.page ? parseInt(req.params.page) : 1,
  };
  const images: Image[] = await getImages(searchConfig);

  res.statusCode = 200;
  res.send(images);
});

app.get("/search/tag/:tag/:page", async (req: Request, res) => {
  const searchConfig: SearchConfig = {
    tags: req.params.tag,
    page: req.params.page ? parseInt(req.params.page) : 1,
  };
  const images: Image[] = await getImages(searchConfig);

  res.statusCode = 200;
  res.send(images);
});

app.get("/search/related/:identifier", async (req: Request, res) => {
  const identifier: string = req.params.identifier;
  const images: Image[] = await getRelatedImages(identifier);

  res.statusCode = 200;
  res.send(images);
});

app.post("/createUser", async (req: Request & { user?: any }, res) => {
  await createUser(req.user);

  res.statusCode = 200;
  res.send("User created");
});

app.post("/userProfile", async (req: Request & { user?: any }, res) => {
  const userInfo: User = await getUserInfo(req.user);

  res.statusCode = 200;
  res.send(userInfo);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
