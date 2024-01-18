import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getLandingPageImages } from "./api/images";

import type { Image } from "./types";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// initialize database if required

app.get("/", async (req: Request, res: Response) => {
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

  res.send(container);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
