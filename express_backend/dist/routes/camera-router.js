"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cameras_json_1 = __importDefault(require("../images/cameras.json"));
const router = (0, express_1.Router)();
let camerasMemory = cameras_json_1.default;
// Get all camera IDs
router.get("/", (req, res) => {
    const camerasId = camerasMemory.map((camera) => ({ id: camera.id }));
    res.json(camerasId);
});
// Get camera by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const camera = camerasMemory.find(camera => camera.id === id);
    if (camera) {
        res.json(camera);
    }
    else {
        res.status(404).json({ status: 404, error: 'No camera found' });
    }
});
// Update camera description
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const searchedCamera = camerasMemory.find(camera => camera.id === id);
    if (!searchedCamera || !body) {
        res.status(404).json({ status: 404, error: 'No camera found' });
    }
    camerasMemory = camerasMemory.map((camera => {
        if (camera.id === id) {
            camera.description = body.description;
            camera.location = body.location;
            camera.name = body.name;
        }
        return camera;
    }));
    res.json(camerasMemory.find(camera => camera.id === id));
});
exports.default = router;
