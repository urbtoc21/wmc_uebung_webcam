import {ClientWebSocket, Message} from "./messageTypes";
import cameras from '../images/cameras.json';

export const handleMessage = (message: Message, client: ClientWebSocket) => {

}

const handleStartStream = (client: ClientWebSocket, cameraId: string) => {

}

/**
 * Read image file and convert to base64 data URL
 */
export const loadImageAsBase64 = (imagePath: string): string => {

};
