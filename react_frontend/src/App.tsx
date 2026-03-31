import { Container, Typography } from '@mui/material'
import { useCameraIds } from './hooks/useCameraIds'
import { CameraGrid } from './components/CameraGrid'
import { CameraViewer } from './components/CameraViewer'
import { useCameraStore } from './store/cameraStore'
import './App.css'

function App() {
  const { cameraIds, error } = useCameraIds()
  const selectedCamera = useCameraStore(state => state.selectedCamera)

  const renderContent = () => {
    if (error) {
      return (
        <Container sx={{ mt: 4 }}>
          <Typography color="error">Fehler beim Laden der Kamera-IDs: {error}</Typography>
        </Container>
      )
    }

    if (cameraIds.length === 0) {
      return (
        <Container sx={{ mt: 4 }}>
          <Typography color="text.secondary">Keine Kameras gefunden.</Typography>
        </Container>
      )
    }

    return (
      <>
        <CameraGrid cameraIds={cameraIds} />
        {selectedCamera && <CameraViewer />}
      </>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="app-title">🏠 Heimüberwachung</h1>
        <p className="app-subtitle">Verwalten Sie Ihre Überwachungskameras</p>
      </div>
      {renderContent()}
    </div>
  )
}

export default App
