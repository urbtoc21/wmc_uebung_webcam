"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const websocket_server_1 = require("./websocket/websocket-server");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Register folder images as /images
app.use('/images', express_1.default.static(path_1.default.join(process.cwd(), 'images')));
// Initialize WebSocket server
//new CameraWebSocketServer(3100)
(0, websocket_server_1.initializeWebSocketServer)(3100);
// start REST server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
express_backend;
