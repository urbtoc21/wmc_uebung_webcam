"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraWebSocketServer = void 0;
const ws_1 = require("ws");
const messageHandler_1 = require("./messageHandler");
class CameraWebSocketServer {
    constructor(port) {
        this.wss = new ws_1.WebSocketServer({ port: port });
        console.log(`WebSocket Server gestartet auf Port ${port}`);
        this.wss.on('connection', (ws) => {
            const client = ws;
            client.id = crypto.randomUUID();
            client.interval = null;
            console.log(`Neuer Client verbunden: ${client.id}`);
            client.on('message', (data) => {
                try {
                    const parsedMessage = JSON.parse(data);
                    (0, messageHandler_1.handleMessage)(parsedMessage, client);
                }
                catch (error) {
                    console.error("Fehler beim Parsen der Nachricht:", error);
                }
            });
            client.on('close', () => {
                console.log(`Client getrennt: ${client.id}`);
                if (client.interval) {
                    clearInterval(client.interval);
                }
            });
        });
    }
}
exports.CameraWebSocketServer = CameraWebSocketServer;
