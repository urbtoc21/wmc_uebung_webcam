import {create} from 'zustand'
import type {Camera} from '../types/Camera'

interface CameraStore {
    selectedCamera : Camera | null
}

export const useCameraStore = create<CameraStore>((set) => ({

    selectedCamera: null,
    selectCamera(camera : Camera) : void {
        set({selectedCamera: camera});
    },
    deselectCamera() : void {
        set({selectedCamera: null});
    }
}))

