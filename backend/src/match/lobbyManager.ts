import { WebSocket } from "ws";
import { MatchManager } from "./matchManager";

// Socket shape expected from the WS layer — playerId gets set on connection/init
interface LobbySocket extends WebSocket {
  playerId?: string;
  playerName?: string;
}

function makePrivateCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export class LobbyManager {
  private queue: LobbySocket[] = [];
  private privatePending: Map<string, LobbySocket> = new Map();

  constructor(private matchManager: MatchManager) {}

  joinQueue(ws: LobbySocket) {
    if (!ws.playerId) return;

    // Check if this player ID is already in the queue from another tab
    const alreadyQueued = this.queue.find(s => s.playerId === ws.playerId);
    if (alreadyQueued) {
      if (alreadyQueued !== ws) {
        ws.send(JSON.stringify({ type: "error", message: "Already in queue in another tab" }));
      }
      return;
    }

    this.queue.push(ws);

    ws.send(JSON.stringify({ type: "queue_joined", position: this.queue.length }));

    // FCFS — pair up the moment we have 2 UNIQUE players
    if (this.queue.length >= 2) {
      const [a, b] = this.queue.splice(0, 2);
      this.startMatch([a, b]);
    }
  }

  leaveQueue(ws: LobbySocket) {
    this.queue = this.queue.filter(s => s !== ws);
  }

  createPrivate(ws: LobbySocket) {
    const code = makePrivateCode();
    this.privatePending.set(code, ws);
    ws.send(JSON.stringify({ type: "private_created", code }));
  }

  joinPrivate(ws: LobbySocket, code: string) {
    if (!ws.playerId) return;
    const host = this.privatePending.get(code);

    if (!host || host.readyState !== WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "error", message: "invalid or expired code" }));
      return;
    }

    if (host.playerId === ws.playerId) {
      ws.send(JSON.stringify({ type: "error", message: "You cannot match against yourself" }));
      return;
    }

    this.privatePending.delete(code);
    this.startMatch([host, ws]);
  }

  // Removes a socket from any lobby state on disconnect
  cleanup(ws: LobbySocket) {
    this.leaveQueue(ws);
    for (const [code, host] of this.privatePending) {
      if (host === ws) this.privatePending.delete(code);
    }
  }

  private startMatch(sockets: LobbySocket[]) {
    const playerConfigs = sockets.map(s => ({
      id: s.playerId ?? `anon_${Math.random().toString(36).slice(2, 7)}`,
      name: s.playerName ?? "Anon"
    }));

    const session = this.matchManager.createMatch(playerConfigs, Date.now());

    sockets.forEach((s, i) => {
      const config = playerConfigs[i];
      session.addClient(config.id, s);
      s.send(JSON.stringify({
        type: "match_found",
        matchId: session.getMatchId(),
        playerId: config.id,
      }));
    });
  }
}
