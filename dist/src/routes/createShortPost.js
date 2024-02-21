"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortPostOptions = void 0;
const createTrack_1 = require("./createTrack");
const createShortPostBodySchema = {
    type: "object",
    required: ["user_id", "text", "track", "time_in", "time_out"],
    properties: {
        user_id: { type: "string" },
        text: { type: "string" },
        track: {
            type: "object",
            properties: createTrack_1.createTrackOptions.schema.body.properties,
            required: createTrack_1.createTrackOptions.schema.body.required,
        },
        time_in: { type: "number" },
        time_out: { type: "number" },
    },
};
exports.createShortPostOptions = {
    schema: { body: createShortPostBodySchema },
};
