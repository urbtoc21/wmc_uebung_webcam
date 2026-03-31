import {WebSocket}  from "ws";

export interface ClientWebSocket extends WebSocket {
    id: string;
    interval: NodeJS.Timeout | null;
}

// Messages Client -> Server
export type PlayCameraMessage = {
    type: 'play'
    cameraId: string
}

// Messages Server -> Client
export type LiveImageMessage = {
    type: 'image'
    imageData: string
}


export type Message =
    PlayCameraMessage
    | LiveImageMessage;

