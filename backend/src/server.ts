import express from "express";
import http from "http";
import path from "path";
import { setupWebSocketServer } from "./websocket";
import { MatchManager } from "./match/matchManager";
import { LobbyManager } from "./match/lobbyManager";

const app = express();
const server = http.createServer(app);

app.use(express.json());

// Serve static files from the frontend dist folder
// Path is relative to backend/dist/server.js
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const matchManager = new MatchManager();
const lobbyManager = new LobbyManager(matchManager);

setupWebSocketServer(server, matchManager, lobbyManager);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
