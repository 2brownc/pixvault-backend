import { authConfig } from "../authConfig";
import { auth } from "express-oauth2-jwt-bearer";

export const verifyToken = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  tokenSigningAlg: "HS256",
});
