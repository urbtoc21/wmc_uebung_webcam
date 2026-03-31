import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import type { Camera } from '../types/Camera'
import { updateCamera } from '../services/cameraService'

interface CameraEditDialogProps {
  camera: Camera
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CameraEditDialog = ({ camera, open, onClose, onSuccess }: CameraEditDialogProps) => {

  const [name, setName] = useState(camera.name)
  const [location, setLocation] = useState(camera.location)
  const [description, setDescription] = useState(camera.description)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateCamera(camera.id, { name, location, description });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Fehler beim Speichern der Kamera:", error);
      alert("Fehler beim Speichern der Kamera.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Kamera bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
          />
          <TextField
              margin="dense"
              label="Standort"
              fullWidth
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mb: 2 }}
          />
          <TextField
              margin="dense"
              label="Beschreibung"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={isSaving}>Abbrechen</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={isSaving}>
            {isSaving ? 'Speichern...' : 'Speichern'}
          </Button>
        </DialogActions>
      </Dialog>
  )
}
