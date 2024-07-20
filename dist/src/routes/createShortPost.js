"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortPostOptions = void 0;
const createTrack_1 = require("./createTrack");
const createShortPostBodySchema = {
    type: "object",
    required: ["text", "track", "timeIn", "timeOut", "extId"],
    properties: {
        text: { type: "string" },
        track: {
            type: "object",
            properties: createTrack_1.createTrackOptions.schema.body.properties,
            required: createTrack_1.createTrackOptions.schema.body.required,
        },
        timeIn: { type: "number" },
        timeOut: { type: "number" },
        extId: { type: "string" },
    },
};
exports.createShortPostOptions = {
    schema: { body: createShortPostBodySchema },
};
