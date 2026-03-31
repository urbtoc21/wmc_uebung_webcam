import { Box, Container } from '@mui/material'
import type { CameraID } from '../types/Camera'
import { CameraCard } from './CameraCard'

interface CameraGridProps {
  cameraIds: CameraID[]
}

export const CameraGrid = (cameraGridProps: CameraGridProps) => {
  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))'
          }
        }}
      >
        {cameraGridProps.cameraIds.map((cameraId) => (
          <CameraCard key={cameraId.id} cameraId={cameraId.id} />
        ))}
      </Box>
    </Container>
  )
}
