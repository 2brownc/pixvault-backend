import dotenv from "dotenv";

dotenv.config();

export const authConfig: any = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
};
