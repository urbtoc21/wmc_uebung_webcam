"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImageAsBase64 = exports.handleMessage = void 0;
const cameras_json_1 = __importDefault(require("../images/cameras.json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleMessage = (message, client) => {
    switch (message.type) {
        case 'play':
            handleStartStream(client, message.cameraId);
            break;
        default:
            console.error(message);
            break;
    }
};
exports.handleMessage = handleMessage;
const handleStartStream = (client, cameraId) => {
    const camera = cameras_json_1.default.find(camera => camera.id === cameraId);
    if (!camera) {
        console.error(`Camera with ID ${cameraId} not found`);
        return;
    }
    if (client.interval) {
        clearInterval(client.interval);
    }
    let counter = 0;
    client.interval = setInterval(() => {
        const img = (0, exports.loadImageAsBase64)("./" + camera.frames[counter]);
        const liveMessage = {
            type: "image",
            imageData: img
        };
        client.send(JSON.stringify(liveMessage));
        if (counter < 9) {
            counter++;
        }
        else {
            counter = 0;
        }
    }, 500);
};
/**
 * Read image file and convert to base64 data URL
 */
const loadImageAsBase64 = (imagePath) => {
    // 1. Absoluten Pfad zur Datei erstellen
    const fullPath = path_1.default.join(process.cwd(), imagePath);
    // 2. Datei synchron als Buffer einlesen
    const imageBuffer = fs_1.default.readFileSync(fullPath);
    // 3. Buffer in Base64 umwandeln
    const base64String = imageBuffer.toString('base64');
    // 4. Data-URL Prefix anhängen und zurückgeben
    return `data:image/jpeg;base64,${base64String}`;
};
exports.loadImageAsBase64 = loadImageAsBase64;
