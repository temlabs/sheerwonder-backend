"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSpotifyAccessToken = exports.fetchSpotifyAuthorizationTokens = exports.extractAuthCodeFromUrl = exports.constructSpotifyLoginUri = exports.throwSpotifyAuthError = void 0;
const config_1 = require("./config");
const throwSpotifyAuthError = (errorResponse) => {
    if (typeof errorResponse !== "object") {
        return;
    }
    if ("error_description" in errorResponse &&
        typeof errorResponse.error_description === "string") {
        const exception = new Error(errorResponse.error_description);
        if ("error" in errorResponse && typeof errorResponse.error === "string")
            exception.name = errorResponse.error;
        throw exception;
    }
};
exports.throwSpotifyAuthError = throwSpotifyAuthError;
const constructSpotifyLoginUri = () => {
    const queryObject = {
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: config_1.SCOPE,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    };
    const queryParams = new URLSearchParams(queryObject);
    const queryString = queryParams.toString();
    return "https://accounts.spotify.com/authorize?" + queryString;
};
exports.constructSpotifyLoginUri = constructSpotifyLoginUri;
const extractAuthCodeFromUrl = (query) => {
    const codeRegex = /code=([^&]+)/;
    const match = query.match(codeRegex);
    return match ? match[1] : null;
};
exports.extractAuthCodeFromUrl = extractAuthCodeFromUrl;
const fetchSpotifyAuthorizationTokens = async (authCode) => {
    const url = `${config_1.SPOTIFY_BASE_URL}/api/token`;
    console.debug({ clientId: process.env.SPOTIFY_CLIENT_ID });
    const encodedKeys = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
    const formData = {
        code: authCode,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
    };
    const body = Object.keys(formData)
        .map((key) => encodeURIComponent(key) +
        "=" +
        encodeURIComponent(formData[key]))
        .join("&");
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + encodedKeys,
    };
    const res = await fetch(url, { method: "POST", headers, body });
    const resJson = (await res.json());
    (0, exports.throwSpotifyAuthError)(resJson);
    return {
        accessToken: resJson.access_token,
        expiresIn: resJson.expires_in,
        refreshToken: resJson.refresh_token,
        scope: resJson.scope,
    };
};
exports.fetchSpotifyAuthorizationTokens = fetchSpotifyAuthorizationTokens;
const refreshSpotifyAccessToken = async (refreshtoken) => {
    const url = `${config_1.SPOTIFY_BASE_URL}/api/token`;
    const encodedKeys = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
    const formData = {
        refresh_token: refreshtoken,
        grant_type: "refresh_token",
    };
    const body = Object.keys(formData)
        .map((key) => encodeURIComponent(key) +
        "=" +
        encodeURIComponent(formData[key]))
        .join("&");
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + encodedKeys,
    };
    const res = await fetch(url, { method: "POST", headers, body });
    const resData = (await res.json());
    (0, exports.throwSpotifyAuthError)(resData);
    const authTokens = {
        accessToken: resData.access_token,
        scope: resData.scope,
        expiresIn: resData.expires_in,
        refreshToken: resData.refresh_token,
    };
    return authTokens;
};
exports.refreshSpotifyAccessToken = refreshSpotifyAccessToken;
