"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructSpotifyLoginUri = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomString = (length) => {
    const array = new Uint8Array(length);
    crypto_1.default.getRandomValues(array);
    return Array.from(array, (byte) => {
        // Convert to base-62 (alphanumeric)
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return possible[byte % possible.length];
    }).join("");
};
const constructSpotifyLoginUri = () => {
    const state = generateRandomString(16);
    const queryObject = {
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: process.env.SPOTIFY_SCOPE,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state,
    };
    const queryParams = new URLSearchParams(queryObject);
    const queryString = queryParams.toString();
    return {
        uri: "https://accounts.spotify.com/authorize?" + queryString,
        state,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    };
};
exports.constructSpotifyLoginUri = constructSpotifyLoginUri;
