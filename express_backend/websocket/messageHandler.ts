import {ClientWebSocket, LiveImageMessage, Message} from "./messageTypes";
import cameras from '../images/cameras.json';
import fs from 'fs';
import path from 'path';

export const handleMessage = (message: Message, client: ClientWebSocket) => {
        switch (message.type) {
            case 'play':
                handleStartStream(client, message.cameraId);
                break;
            default:
                console.error(message);
                break;
        }
}

const handleStartStream = (client: ClientWebSocket, cameraId: string) => {
    const camera = cameras.find(camera => camera.id === cameraId);
    if (!camera) {
        console.error(`Camera with ID ${cameraId} not found`);
        return;
    }

    if (client.interval) {
        clearInterval(client.interval);
    }

    let counter : number = 0;
    client.interval = setInterval(() => {
        const img = loadImageAsBase64("./" + camera.frames[counter]);
        const liveMessage : LiveImageMessage = {
            type: "image",
            imageData: img
        };
        if(client.readyState === client.OPEN){
            client.send(JSON.stringify(liveMessage));
        }
        if(counter < 9){
            counter++;
        }
        else {
            counter = 0;
        }
    }, 500);
}

/**
 * Read image file and convert to base64 data URL
 */
export const loadImageAsBase64 = (imagePath: string): string => {

    const fullPath = path.join(process.cwd(), imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    const base64String = imageBuffer.toString('base64');

    return `data:image/jpeg;base64,${base64String}`;
};
