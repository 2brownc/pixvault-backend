import axios from "axios";
import { TokenResponse } from "../types";

// Get access token to continue making API requests

export async function getAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<TokenResponse> {
  const url = "https://api.openverse.engineering/v1/auth_tokens/token/";
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "client_credentials");

  try {
    const response: TokenResponse = await axios.post(url, params);
    return response;
  } catch (error) {
    throw new Error(`Failed to get access token: ${error}`);
  }
}
