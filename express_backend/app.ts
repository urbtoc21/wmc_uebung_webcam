import express, {Application} from 'express';
import path from 'path';
import cors from 'cors';
import {initializeWebSocketServer} from "./websocket/websocket-server";
import cameraRouter from "./routes/camera-router";
import {CameraWebSocketServer} from "./websocket/CameraWebSocketServer";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Register folder images as /images
app.use('/images', express.static(path.join(process.cwd(), 'images')));

app.use('/api/cameras', cameraRouter);

// Initialize WebSocket server
new CameraWebSocketServer(3100)
// initializeWebSocketServer(3100)

// start REST server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;