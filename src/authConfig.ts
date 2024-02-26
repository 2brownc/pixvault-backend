import dotenv from "dotenv"

dotenv.config()

type authConfigType = {
  issuerBaseURL: string
  tokenSigningAlg: string
  audience: string
}

if (!process.env.AUTH0_ISSUER_BASE_URL) {
  throw new Error("AUTH0_ISSUER_BASE_URL environment variable not set")
}

if (!process.env.AUTH0_ALGORITHM) {
  throw new Error("AUTH0_ALGORITHM environment variable not set")
}

if (!process.env.AUTH0_AUDIENCE) {
  throw new Error("AUTH0_AUDIENCE environment variable not set")
}

export const authConfig: authConfigType = {
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_ALGORITHM,
  audience: process.env.AUTH0_AUDIENCE,
}
