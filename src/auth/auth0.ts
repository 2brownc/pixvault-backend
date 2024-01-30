import { auth } from "express-oauth2-jwt-bearer";
import { authConfig } from "../authConfig";

/* Auth0 tokecn checking as middleware*/
export const verifyAuth0Token = auth(authConfig);
