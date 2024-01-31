import axios from "axios";
import dotenv from "dotenv";
import type { TokenResponse, Image, SearchConfig, ImageId } from "../types";
import { getAccessToken } from "./auth";

// load env variables
dotenv.config();

// Access token is required to make any request to OPENVERSEAPI
let access_token: TokenResponse | null = null;
/* Access token expires every 12 hours,
so update it every 11 hours to be safe */
async function updateAccessToken(): Promise<void> {
  const clientId = process.env.OPENVERSE_CLIENT_ID;
  const clientSecret = process.env.OPENVERSE_CLIENT_SECRET;
  if (clientId && clientSecret) {
    try {
      access_token = await getAccessToken(clientId, clientSecret);
    } catch (error) {
      throw new Error(`Failed to get access_token: ${error}`);
    }
  } else {
    throw new Error(
      "Missing OPENVERSE_CLIENT_ID or OPENVERSE_CLIENT_SECRET; Cannot set access_token.",
    );
  }
}
(async () => await updateAccessToken())();
setInterval(updateAccessToken, 11 * 1000 * 60 * 60);
async function waitForAccessToken(): Promise<void> {
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  if (!access_token) {
    await delay(5 * 1000);
    if (!access_token) {
      await updateAccessToken();
    }
  }
}

export async function getImages(
  config: SearchConfig = {
    page: 1,
  },
): Promise<Image[]> {
  await waitForAccessToken();
  if (!access_token) {
    throw new Error("No access_token; Cannot get images.");
  }

  if (config.page && (config.page < 1 || config.page > 20)) {
    throw new Error("Page number must be between 1 and 20");
  }

  const url = "https://api.openverse.engineering/v1/images";
  const params = config;
  const response = await axios.get(url, {
    params: params,
    headers: {
      Authorization: `Bearer ${access_token.access_token}`,
    },
  });
  if (response.status === 200) {
    const images: Image[] = [];
    for (const result of response.data.results) {
      images.push({
        id: result.id,
        title: result.title,
        indexed_on: result.indexed_on,
        foreign_landing_url: result.foreign_landing_url,
        url: result.url,
        creator: result.creator,
        creator_url: result.creator_url,
        license: result.license,
        license_version: result.license_version,
        license_url: result.license_url,
        provider: result.provider,
        source: result.source,
        category: result.category,
        filesize: result.filesize,
        filetype: result.filetype,
        tags: result.tags.map((tag: any) => tag.name),
        attribution: result.attribution,
        mature: result.mature,
        thumbnail: result.thumbnail,
        related_url: result.related_url,
      });
    }
    return images;
  } else {
    throw new Error(
      `Failed to get images: ${response.status} ${response.statusText}`,
    );
  }
}

export async function getRelatedImages(identifier: string): Promise<Image[]> {
  await waitForAccessToken();
  if (!access_token) {
    throw new Error("No access_token; Cannot get images.");
  }

  const url = `https://api.openverse.engineering/v1/images/${identifier}/related/`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${access_token.access_token}`,
    },
  });
  if (response.status === 200) {
    const images: Image[] = [];
    for (const result of response.data.results) {
      images.push({
        id: result.id,
        title: result.title,
        indexed_on: result.indexed_on,
        foreign_landing_url: result.foreign_landing_url,
        url: result.url,
        creator: result.creator,
        creator_url: result.creator_url,
        license: result.license,
        license_version: result.license_version,
        license_url: result.license_url,
        provider: result.provider,
        source: result.source,
        category: result.category,
        filesize: result.filesize,
        filetype: result.filetype,
        tags: result.tags.map((tag: string) => tag),
        attribution: result.attribution,
        mature: result.mature,
        thumbnail: result.thumbnail,
        related_url: result.related_url,
      });
    }
    return images;
  } else {
    throw new Error(
      `Failed to get images: ${response.status} ${response.statusText}`,
    );
  }
}

export async function getLandingPageImages(): Promise<Image[]> {
  const config: SearchConfig = {
    page: 1,
    q: "wallpaper+nature",
  };

  const images: Image[] = await getImages(config);

  return images;
}

export async function getImageInfo(identifier: ImageId): Promise<Image> {
  await waitForAccessToken();
  if (!access_token) {
    throw new Error("No access_token; Cannot get images.");
  }

  const url = `https://api.openverse.engineering/v1/images/${identifier}/`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${access_token.access_token}`,
    },
  });
  if (response.status === 200) {
    const result = response.data;
    return {
      id: result.id,
      title: result.title,
      indexed_on: result.indexed_on,
      foreign_landing_url: result.foreign_landing_url,
      url: result.url,
      creator: result.creator,
      creator_url: result.creator_url,
      license: result.license,
      license_version: result.license_version,
      license_url: result.license_url,
      provider: result.provider,
      source: result.source,
      category: result.category,
      filesize: result.filesize,
      filetype: result.filetype,
      tags: result.tags.map((tag: any) => tag.name),
      attribution: result.attribution,
      mature: result.mature,
      thumbnail: result.thumbnail,
      related_url: result.related_url,
    } as Image;
  } else {
    throw new Error(
      `Failed to get images: ${response.status} ${response.statusText}`,
    );
  }
}

export async function getImagesInfo(identifiers: ImageId[]): Promise<Image[]> {
  const images: Image[] = [];
  for (const identifier of identifiers) {
    images.push(await getImageInfo(identifier));
  }

  return images;
}
