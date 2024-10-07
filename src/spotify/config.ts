export const SPOTIFY_ACCESS_TOKEN_STALE_TIME = 3300 * 1000;
export const SPOTIFY_BASE_URL = "https://accounts.spotify.com";
export const SPOTIFY_PLAYER_BASE_URL = "https://api.spotify.com/v1/me/player";
export const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
export const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI as string;
export const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
export const SCOPE =
  "user-read-private user-modify-playback-state user-read-playback-state streaming playlist-read-private user-read-recently-played";
