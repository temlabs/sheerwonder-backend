"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrackOptions = void 0;
const createTrackBodySchema = {
    type: "object",
    required: ["artist", "spotify_id", "duration", "name"],
    properties: {
        artist: { type: "string" },
        artwork: { type: "string" },
        name: { type: "string" },
        spotify_id: {
            type: "string",
        },
    },
};
exports.createTrackOptions = {
    schema: { body: createTrackBodySchema },
};
