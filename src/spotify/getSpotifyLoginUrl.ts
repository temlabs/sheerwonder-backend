import crypto from "crypto";

const generateRandomString = (length: number) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => {
    // Convert to base-62 (alphanumeric)
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return possible[byte % possible.length];
  }).join("");
};

export const constructSpotifyLoginUri = (): {
  uri: string;
  state: string;
  redirectUri: string;
} => {
  const state = generateRandomString(16);
  const queryObject = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID as string,
    scope: process.env.SPOTIFY_REDIRECT_URI as string,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
    state,
  };
  const queryParams = new URLSearchParams(queryObject);
  const queryString = queryParams.toString();
  return {
    uri: "https://accounts.spotify.com/authorize?" + queryString,
    state,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI as string,
  };
};
