import { WebSocket } from "ws";
import { Match } from "./match";

export class MatchSession {
  private clients: Map<string, WebSocket> = new Map();

  constructor(private match: Match) {
    match.setEventCallback((events) => this.broadcast(events));
  }

  addClient(playerId: string, ws: WebSocket) {
    this.clients.set(playerId, ws);
  }

  removeClient(playerId: string) {
    this.clients.delete(playerId);
  }

  handleCommand(playerId: string, command: any) {
    this.match.queueCommand(playerId, command);
  }

  getMatchId() {
    return this.match.id;
  }

  getState(playerId: string) {
    return this.match.getState(playerId);
  }

  private broadcast(events: any[]) {
    for (const ws of this.clients.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "events", events }));
      }
    }
  }
}
