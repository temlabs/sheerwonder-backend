import { SPOTIFY_BASE_URL } from "./config";
import { SpotifyAuthTokensResponse } from "./types";

export const throwSpotifyAuthError = (errorResponse: Object) => {
  if (typeof errorResponse !== "object") {
    return;
  }
  if (
    "error_description" in errorResponse &&
    typeof errorResponse.error_description === "string"
  ) {
    const exception = new Error(errorResponse.error_description);
    if ("error" in errorResponse && typeof errorResponse.error === "string")
      exception.name = errorResponse.error;
    throw exception;
  }
};

export const extractAuthCodeFromUrl = (query: string): string | null => {
  const codeRegex = /code=([^&]+)/;
  const match = query.match(codeRegex);
  return match ? match[1] : null;
};

export const fetchSpotifyAuthorizationTokens = async (authCode: string) => {
  const url = `${SPOTIFY_BASE_URL}/api/token`;
  const encodedKeys = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  ).toString("base64");
  const formData = {
    code: authCode,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
    grant_type: "authorization_code",
  };
  const body = Object.keys(formData)
    .map(
      (key) =>
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(formData[key as keyof typeof formData])
    )
    .join("&");
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + encodedKeys,
  };

  const res = await fetch(url, { method: "POST", headers, body });

  const resJson = (await res.json()) as unknown as SpotifyAuthTokensResponse;
  throwSpotifyAuthError(resJson);
  return {
    accessToken: resJson.access_token,
    expiresIn: resJson.expires_in,
    refreshToken: resJson.refresh_token,
    scope: resJson.scope,
  };
};

export const refreshSpotifyAccessToken = async (refreshtoken: string) => {
  const url = `${SPOTIFY_BASE_URL}/api/token`;
  const encodedKeys = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  ).toString("base64");

  const formData = {
    refresh_token: refreshtoken,
    grant_type: "refresh_token",
  };

  const body = Object.keys(formData)
    .map(
      (key) =>
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(formData[key as keyof typeof formData])
    )
    .join("&");

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + encodedKeys,
  };

  const res = await fetch(url, { method: "POST", headers, body });
  const resData = (await res.json()) as unknown as SpotifyAuthTokensResponse;
  throwSpotifyAuthError(resData);

  const authTokens = {
    accessToken: resData.access_token,
    scope: resData.scope,
    expiresIn: resData.expires_in,
    refreshToken: resData.refresh_token,
  };

  return authTokens;
};
