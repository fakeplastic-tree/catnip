import express from "express";
import http from "http";
import { setupWebSocketServer } from "./websocket";
import { MatchManager } from "./match/matchManager";
import { LobbyManager } from "./match/lobbyManager";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

const matchManager = new MatchManager();
const lobbyManager = new LobbyManager(matchManager);

setupWebSocketServer(server, matchManager, lobbyManager);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
