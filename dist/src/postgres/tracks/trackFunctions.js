"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrack = void 0;
const createTrack = async (dbClient, track) => {
    const { rows } = await dbClient.query("INSERT INTO tracks (artist, name, artwork, spotify_id, duration) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (spotify_id) DO UPDATE SET spotify_id = EXCLUDED.spotify_id RETURNING *", [track.artist, track.name, track.artwork, track.spotify_id, track.duration]);
    return rows;
};
exports.createTrack = createTrack;
