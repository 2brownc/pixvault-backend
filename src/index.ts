import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// initialize database if required

app.get("/", (req: Request, res: Response) => {
  res.send("PIX VALUT");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
