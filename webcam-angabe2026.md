# HTBLA Kaindorf – Übung: Webcam Surveillance (2026)

Höhere Lehranstalt für Informatik

Diese Übung baut ein kleines Webcam‑Überwachungssystem mit einem Express REST‑API, einem WebSocket‑Livestream und einem React Frontend (TypeScript). Die Bilder werden aus lokalen Dateien geladen und als Base64‑Frames gestreamt.

## Architekturüberblick
- Backend (Express, TypeScript)
  - REST‑Endpunkte zur Verwaltung von Kameras (`express_backend/routes/camera-router.ts`)
  - Statisches Serven von Bildern unter `/images`
  - WebSocket‑Server für Live‑Bildübertragung (`express_backend/websocket/*`)
- Frontend (React, Vite, TypeScript)
  - Kameragrid und Karten
  - Inline‑Viewer mit Live‑Stream (`react_frontend/src/components/CameraViewer.tsx`)
  - Bearbeiten von Kameradaten
  - Gemeinsame Message‑Types (`react_frontend/src/common/messageTypes.ts`)

Basis‑URLs:
- REST: `http://localhost:3000`
- WebSocket: `ws://localhost:3100`

## Ziele
- Implementieren von REST‑Routen in Express.
- Design eines WebSocket‑Streams mit korrekten Message‑Typen.
- State‑Management und Hooks in React.
- Saubere Typisierung mit TypeScript und geteilten Typen.

## 4.2.1 Backend‑Entwicklung (Express & TypeScript) – 18 Punkte

Express‑Server Konfiguration (2 Punkte)
- Datei: `express_backend/app.ts`
- CORS, JSON/URL‑Encoded Parser sind vorkonfiguriert
- Static File Serving: `/images` zeigt auf Ordner `express_backend/images`

Camera‑Router registrieren (1 Punkt)
- Importieren Sie den Camera‑Router und registrieren Sie ihn in der Express‑App

REST‑Endpunkte (8 Punkte)
- GET `/api/cameras` (3 Punkte)
  - Liefert Array von `{ id: string }` für alle Kameras
- GET `/api/cameras/:id` (3 Punkte)
  - Liefert komplettes `Camera`‑Objekt
  - 404 bei unbekannter Kamera
- PUT `/api/cameras/:id` (2 Punkte)
  - Aktualisiert `description`, `name`, `location`
  - Antwort: aktualisiertes `Camera`‑Objekt
  - Persistenz optional: in‑memory reicht für diese Übung

WebSocket‑Server initialisieren (1 Punkt)
- Initialisieren Sie den WebSocket‑Server nach der Router‑Registrierung und vor dem Start des REST‑Servers

WebSocket‑Protokoll und Streaming (6 Punkte)
- Dateien: `messageHandler.ts`, `messageTypes.ts`
- Starten Sie einen WebSocket‑Server am Port 3100
- Bei neuen Verbindungen initialisieren Sie für jeden Client ein `client: ClientWebSocket` mit:
  - `id: string` zufällige UUID
  - `interval: NodeJS.Timeout | null` mit `null`
- Beim Empfang neuer Nachrichten: parsen Sie JSON in `Message` und rufen `handleMessage(message, client)` auf
- Bei `PlayCameraMessage` (`type: 'play'`) (4 Punkte):
  - Extrahieren und validieren Sie `cameraId`
  - Starten Sie ein `setInterval` (500ms), iterieren Sie über `frames` der Kamera, lesen Sie die Bilddateien und senden Sie sie als `LiveImageMessage` (`type: 'image', imageData: string`) in einer Endlosschleife
  - Speichern Sie das erzeugte `interval` im Client zur späteren Löschung
- Bei Verbindungsende oder Fehler: `interval` löschen

Hinweise zum Laden der Bilder
- Nutzen Sie `fs.readFileSync` und `path.join(process.cwd(), imagePath)`
- Konvertieren Sie zu Data‑URL: `data:image/jpeg;base64,<BASE64>`

## 4.2.2 Frontend‑Entwicklung (React & TypeScript) – 32 Punkte

Service Layer (6 Punkte)
- Datei: `react_frontend/src/services/cameraService.ts`
- Implementieren/verwenden Sie folgende Funktionen:
  - `fetchCameraIds()` (2 Punkte) – Ruft alle Kamera‑IDs ab
  - `fetchCameraById(id: string)` (2 Punkte) – Ruft vollständige Kamera‑Daten ab
  - `createCameraStreamConnection()` (1 Punkt) – Erstellt WebSocket‑Verbindung
  - `getImageUrl(imagePath: string)` (1 Punkt) – Konvertiert relativen zu absolutem Pfad (nutzt `/images`)

State Management mit Zustand (4 Punkte)
- Datei: `react_frontend/src/store/cameraStore.ts`
- State:
  - `selectedCamera: Camera | null` – aktuell ausgewählte Kamera
- Actions:
  - `selectCamera(camera: Camera): void` – wählt Kamera aus
  - `deselectCamera(): void` – deselektiert Kamera

Custom Hooks (4 Punkte)
- `useCameraIds()` (2 Punkte) – Datei: `react_frontend/src/hooks/useCameraIds.ts`
  - Lädt Kamera‑IDs beim Mount vom Backend
  - Liefert `{ cameraIds: CameraID[], error?: string }`
- `useCamera(cameraId: string)` (2 Punkte) – Datei: `react_frontend/src/hooks/useCamera.ts`
  - Lädt vollständige Kamera‑Daten für eine ID
  - Liefert `{ camera: Camera | null, error?: string }`
  - Re‑Fetch bei `cameraId`‑Änderung

React Components (16 Punkte)

CameraCard (5 Punkte)
- Datei: `react_frontend/src/components/CameraCard.tsx`
- Props: `{ cameraId: string }`
- Funktionalität:
  - Verwendet den `useCamera(cameraId)`‑Hook
  - Zeigt Thumbnail, Name, Standort, Auflösung, Status, Beschreibung
  - Buttons: „Ansehen“ (öffnet Viewer) und „Bearbeiten“ (öffnet Edit‑Dialog)
  - Zeigt Fehlermeldung bei Lade‑Fehler
   - Öffnet den `CameraEditDialog` inkl. Vorbelegung der Formfelder und übernimmt Rückgaben per `onUpdated`
  - Nutzt `useCameraStore` um über `selectCamera` die Karte als aktive Kamera zu setzen

CameraGrid (2 Punkte)
- Datei: `react_frontend/src/components/CameraGrid.tsx`
- Props: `{ cameraIds: CameraID[] }`
- Funktionalität:
  - Rendert für jede Kamera eine `CameraCard`‑Komponente

CameraViewer – Inline‑Livestream (7 Punkte)
- Datei: `react_frontend/src/components/CameraViewer.tsx`
- Funktionalität:
  - Lokaler State: `isStreaming: boolean`, `streamImage: string`
  - Store: `selectedCamera` abrufen
  - `useEffect` reagiert auf Änderungen von `isStreaming` und `selectedCamera`:
    - Öffnet eine WebSocket‑Verbindung mit `createCameraStreamConnection()`
    - Sendet `StartStreamMessage` (`{ type: 'start', cameraId }`)
    - Empfängt `ImageMessage` und aktualisiert `streamImage`
    - Cleanup: `ws.close()` und Interval wird am Server beendet
  - Vor Streaming: Thumbnail‑Bild + „Live‑Stream starten“-Button
  - Während Streaming: aktuelles Stream‑Bild (`streamImage`) + „Stream beenden“-Button

CameraEditDialog (2 Punkte)
- Datei: `react_frontend/src/components/CameraEditDialog.tsx`
- Funktionalität:
  - Formular zur Bearbeitung von `name`, `location`, `description`
  - Speichern via `updateCamera(id, data)` 

App (4 Punkte) – Main Component
- Datei: `react_frontend/src/App.tsx`
- Funktionalität:
  - Lädt Kamera‑IDs beim Mount (`useCameraIds()`)
  - Zeigt Titel („Webcam Surveillance“)
  - Rendert `CameraGrid` und den Inline‑Viewer‑Bereich
  - Edit‑Dialog und Fehleranzeigen

## Start‑Hinweise
- Backend (im Ordner `express_backend`):
  - Abhängigkeiten installieren und starten (siehe `package.json`)
- Frontend (im Ordner `react_frontend`):
  - Abhängigkeiten installieren und starten (siehe `package.json`)
- Stellen Sie sicher, dass `images/cameras.json` und Bildpfade vorhanden sind.
