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