import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import { Box, Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useCamera } from '../hooks/useCamera.ts'
import { getImageUrl } from '../services/cameraService.ts'
import { useCameraStore } from '../store/cameraStore.ts'
import { CameraEditDialog } from './CameraEditDialog.tsx'

interface CameraCardProps {
  cameraId: string
}

export const CameraCard = (cameraCardProps: CameraCardProps) => {
  const { camera, error, refetch } = useCamera(cameraCardProps.cameraId)
  const selectCamera = useCameraStore((state) => state.selectCamera)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const statusLabel = camera?.status ?? 'Unbekannt'
  const statusNormalized = statusLabel.toLowerCase()
  const isActive = statusNormalized.includes('active')

  if (error) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography color="error">Fehler beim Laden der Kamera: {error}</Typography>
      </Card>
    )
  }

  if (!camera) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Kamera wird geladen...
        </Typography>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={getImageUrl(camera.thumbnail)}
        alt={`Thumbnail ${camera.name}`}
      />

      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {camera.name}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1.5 }}>
          <LocationOnOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {camera.location}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: 99,
              bgcolor: isActive ? 'success.light' : 'error.light',
              color: isActive ? 'success.dark' : 'error.dark'
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isActive ? 'success.main' : 'error.main'
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {statusLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.25,
              py: 0.5,
              borderRadius: 99,
              bgcolor: 'info.light',
              color: 'info.dark'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {camera.resolution}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {camera.description}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<VideocamOutlinedIcon />} onClick={() => selectCamera(camera)}>
            Ansehen
          </Button>
          <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setIsEditDialogOpen(true)}>
            Bearbeiten
          </Button>
        </Stack>
      </CardContent>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <CameraEditDialog
          camera={camera}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={() => refetch()}
        />
      )}
    </Card>
  )
}
