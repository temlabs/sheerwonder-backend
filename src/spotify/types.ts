export interface SpotifyAuthTokensResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface SpotifyAuthTokens {
  accessToken: string;
  scope: string;
  expiresIn: number;
  refreshToken: string;
}

export interface GetSpotifyTokensBody {
  authCode: string;
}
