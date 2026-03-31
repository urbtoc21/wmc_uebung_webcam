import axios from 'axios'
import type {Camera, CameraID} from '../types/Camera'

const API_BASE_URL = 'http://localhost:3000'
const WS_BASE_URL = 'ws://localhost:3100'

/**
 * Fetch all camera IDs from the backend
 */
export const fetchCameraIds = async (): Promise<CameraID[]> => {
  const response = await axios.get<CameraID[]>(`${API_BASE_URL}/cameras`)
  return response.data
}

/**
 * Fetch a single camera by ID
 */
export const fetchCameraById = async (id: string) : Promise<Camera> => {
    const response = await axios.get<Camera>(`${API_BASE_URL}/cameras/${id}`);
    if(response.status === 404){
        throw new Error(`Camera with ID ${id} not found`);
    }
    return response.data;
}

/**
 * Update camera information
 */
export const updateCamera = async (id: string, data: { name?: string; location?: string; description?: string }) : Promise<Camera> => {
    const body = {
        name: data.name,
        location: data.location,
        description: data.description,
    }
    const response = await axios.put<Camera>(`${API_BASE_URL}/cameras/${id}`, body);
    if(response.status === 404){
        throw new Error(`Camera with ID ${id} not found`);
    }
    return response.data;
}

/**
 * Create a WebSocket connection for camera streaming
 */
export const createCameraStreamConnection = () => {
    const socket = new WebSocket(WS_BASE_URL);
    socket.onopen = () => {
        console.log('Connection opened');
    }
}

/**
 * Get the full URL for a camera thumbnail image
 * Used for static thumbnail loading via HTTP, NOT for live WebSocket streams
 */
export const getImageUrl = (imagePath: string) => {
  return `${API_BASE_URL}/${imagePath}`
}

