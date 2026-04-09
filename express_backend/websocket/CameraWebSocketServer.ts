import {WebSocketServer as WSS, WebSocket} from "ws";
import {ClientWebSocket, Message} from "./messageTypes";
import {handleMessage} from "./messageHandler";


export class CameraWebSocketServer {
    private wss: WSS;

    constructor(port: number) {
        this.wss = new WSS({port: port});

        console.log(`WebSocket Server gestartet auf Port ${port}`);

        this.wss.on('connection', (ws : WebSocket) => {
            const client = ws as ClientWebSocket;
            client.id = crypto.randomUUID();
            client.interval = null;
            console.log(`Neuer Client verbunden: ${client.id}`);

            client.on('message', (data : any) => {
                try {
                    const parsedMessage = JSON.parse(data) as Message;
                    handleMessage(parsedMessage, client);
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

            client.on('error', (err: Error) => {
                console.error(err);

                if(client.interval) {
                    clearInterval(client.interval);
                }
            })
        })
    }
}