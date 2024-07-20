"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrackOptions = void 0;
const createTrackBodySchema = {
    type: "object",
    required: ["artist", "spotifyId", "duration", "name", "artwork"],
    properties: {
        artist: { type: "string" },
        artwork: { type: "string" },
        name: { type: "string" },
        spotifyId: {
            type: "string",
        },
    },
};
exports.createTrackOptions = {
    schema: { body: createTrackBodySchema },
};
