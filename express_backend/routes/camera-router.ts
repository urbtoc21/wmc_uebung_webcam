import {Request, Response, Router} from 'express';
import cameras from '../images/cameras.json';
import {Camera, CameraID} from "../common/Camera";

const router = Router();

let camerasMemory : Camera[] = cameras;

// Get all camera IDs
router.get("/", (req: Request, res: Response) => {
    const camerasId : CameraID[] = camerasMemory.map((camera) => ({id: camera.id}));
    res.json(camerasId);
});

// Get camera by ID
router.get("/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const camera : Camera | undefined = camerasMemory.find(camera => camera.id === id);
    if(camera){
        res.json(camera);
    }
    else{
        res.status(404).json({status: 404, error: 'No camera found'});
    }
})

// Update camera description
router.put("/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const searchedCamera : Camera | undefined = camerasMemory.find(camera => camera.id === id);
    if(!searchedCamera || !body){
        res.status(404).json({status: 404, error: 'No camera found'});
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
})

export default router;

