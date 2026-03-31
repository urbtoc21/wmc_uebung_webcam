import { useState, useEffect, useCallback } from 'react'
import type { Camera } from '../types/Camera'
import {fetchCameraById} from "../services/cameraService.ts";

/**
 * Custom hook to fetch a single camera by ID
 * Re-fetches automatically when cameraId changes
 */
export const useCamera = (cameraId: string) => {
    const [camera, setCamera] = useState<Camera | null>(null);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        try {
            setError(null);
            const response: Camera = await fetchCameraById(cameraId);
            setCamera(response);
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Failed to load camera by ID');
            console.error('Error loading camera by ID:', err);
            setCamera(null);
        }
    }, [cameraId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { camera, error, refetch };
}
