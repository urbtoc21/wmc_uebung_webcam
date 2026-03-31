import {useEffect, useState} from 'react'
import {type Message, type PlayCameraMessage} from "../common/messageTypes.ts";
import {useCameraStore} from "../store/cameraStore.ts";
import {createCameraStreamConnection, getImageUrl} from "../services/cameraService.ts";
import {Box, Button, Container, Grid, IconButton, Paper, Stack, Typography} from "@mui/material";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const CameraViewer = () => {

    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const {selectedCamera, deselectCamera} = useCameraStore();
    const [streamImage, setStreamImage] = useState<string>(getImageUrl(selectedCamera?.thumbnail) || "");

    useEffect(() => {
        if (!isStreaming || !selectedCamera) return;

        const socket = createCameraStreamConnection();

        socket.onopen = () => {
            console.log('Connection opened');
            const startMessage : PlayCameraMessage = {
                type: "play",
                cameraId: selectedCamera.id
            }
            socket.send(JSON.stringify(startMessage));
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as Message;
            switch (message.type) {
                case "image":
                    setStreamImage(message.imageData);
                break;
            }
        };

        socket.onclose = () => {
            console.log('Connection closed');
        }

        return () => {
            socket.close();
            setStreamImage(getImageUrl(selectedCamera.thumbnail));
        }
    }, [isStreaming, selectedCamera]);

    if (!selectedCamera) return null;

    // Dynamisches Seitenverhältnis basierend auf dem String (z.B. "1920x1080" oder "1280x720") berechnen
    const getAspectRatio = (resolution: string) => {
        if (!resolution) return '16/9';
        const parts = resolution.toLowerCase().split('x');
        if (parts.length === 2) {
            const width = parseInt(parts[0], 10);
            const height = parseInt(parts[1], 10);
            if (!isNaN(width) && !isNaN(height) && height !== 0) {
                return `${width}/${height}`;
            }
        }
        return '16/9'; // Default Fallback
    };

    const aspectRatio = getAspectRatio(selectedCamera.resolution);

    const statusNormalized = (selectedCamera.status || '').toLowerCase();
    const isActive = statusNormalized.includes('active');

    return (
        <Container sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CameraAltOutlinedIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>{selectedCamera.name}</Typography>
                    </Stack>
                    <IconButton onClick={deselectCamera} aria-label="schließen">
                        <CloseOutlinedIcon />
                    </IconButton>
                </Stack>

                <Grid container spacing={3}>
                    {/* Videobereich (75%) */}
                    <Grid size={9}>
                        <Box sx={{
                            width: '100%',
                            aspectRatio: aspectRatio,
                            bgcolor: 'black',
                            borderRadius: 2,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                                <img
                                    src={streamImage}
                                    alt={"StreamImage"}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                        </Box>
                    </Grid>

                    {/* Details Container (25%) */}
                    <Grid size={3}>
                        <Stack spacing={2} sx={{ height: '100%' }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Standort</Typography>
                                <Typography variant="body1">{selectedCamera.location}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Auflösung</Typography>
                                <Typography variant="body1">{selectedCamera.resolution}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: isActive ? 'success.main' : 'error.main'
                                        }}
                                    />
                                    <Typography variant="body1">{isActive ? "Aktiv" : "Nicht aktiv"}</Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Beschreibung</Typography>
                                <Typography variant="body2">{selectedCamera.description}</Typography>
                            </Box>

                            {/* Stream Controls */}
                            <Box sx={{ pt: 2, mt: 'auto' }}>
                                {isStreaming ? (
                                    <Stack spacing={1.5}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 99,
                                            bgcolor: 'error.main',
                                            color: 'white',
                                            alignSelf: 'flex-start'
                                        }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 12 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1 }}>LIVE</Typography>
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            startIcon={<StopOutlinedIcon />}
                                            onClick={() => setIsStreaming(false)}
                                        >
                                            Stream beenden
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<PlayArrowOutlinedIcon />}
                                        onClick={() => setIsStreaming(true)}
                                    >
                                        Live-Stream starten
                                    </Button>
                                )}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}
