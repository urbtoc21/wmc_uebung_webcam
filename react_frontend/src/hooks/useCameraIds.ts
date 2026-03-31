import {useEffect, useState} from 'react'
import type {CameraID} from "../types/Camera.ts";
import {fetchCameraIds} from "../services/cameraService.ts";

/**
 * Custom hook to load all camera IDs on mount
 */
export const useCameraIds = () => {
    const [cameraIds, setCameraIds] = useState<CameraID[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadCameraIds = async () => {
            try {
                const ids = await fetchCameraIds()
                setCameraIds(ids)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load camera IDs')
                console.error('Error loading camera IDs:', err)
            }
        }

        loadCameraIds()
    }, [])

    return { cameraIds, error }
}

