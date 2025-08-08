"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.verify = verify;
const crypto_1 = require("crypto");
function secretFromEnv() {
    const secret = process.env.SPIRAL_EVENT_SECRET;
    if (!secret) {
        throw new Error('SPIRAL_EVENT_SECRET must be set in production');
    }
    return secret;
}
function sign(payload) {
    const secret = secretFromEnv();
    const h = (0, crypto_1.createHmac)('sha256', secret);
    h.update(JSON.stringify(payload));
    return h.digest('hex');
}
function verify(payload, signature) {
    return sign(payload) === signature;
}
