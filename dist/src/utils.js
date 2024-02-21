"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUUID = void 0;
function extractUUID(inputString) {
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match = inputString.match(uuidRegex);
    return match ? match[0] : null;
}
exports.extractUUID = extractUUID;
