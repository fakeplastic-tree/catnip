# 🐾 Catnip Conquest

**Catnip Conquest** is a low-latency, hex-based multiplayer strategy game built with a "code-first" philosophy. Command an army of tactical felines, manage your Catnip resources, and defend your Cat Tree against rival clowders.

Designed with a focus on **deterministic simulation** and **cross-platform type safety**, the game provides a snappy, responsive experience even on low-spec hardware.

---

## 🚀 Technical Highlights

### ⚡ Deterministic Simulation Engine
The core game logic lives in a standalone simulation layer shared (via TypeScript) between the client and server. 
- **Predictive Client-Side Logic**: The frontend uses the same simulation code to provide instant visual feedback (ghost units, pathing previews) before the server confirms the turn.
- **Phase-Based Resolution**: Combat is resolved in a structured "Combat Phase" where initiative (Speed) and positioning determine the outcome, ensuring every match is fair and predictable.

### 🏗️ Advanced Architecture
- **Unified Logic Hub**: All unit stats, card effects, and game rules reside in a `shared/` directory, imported by both the Svelte frontend and Node.js backend to prevent "brain-split" bugs.
- **Tactical Hex Engine**: 
  - Efficient **BFS (Breadth-First Search)** for movement and range calculations.
  - **Symmetric Map Generation** ensures competitive balance.
  - **Spatial Querying**: Optimized targeting for multi-strike and area-of-effect abilities.

### 🐈 Latest Feature: Cat Tree Attachment System
The Cat Tree is no longer a static landmark. It now supports a dynamic **Mod/Attachment System**:
- **Multi-Target Logic**: Refactored combat targeting allows the Cat Tree to track and strike multiple unique targets per turn.
- **Dynamic Equipment**: Attachments like **Cannons**, **Catapults**, and **Cat Wizards** grant additional attacks, range extensions, or instant utility (Healing/Zapping).
- **Structural Layering**: Integrated damage-absorption logic where shields take the hit before the tower's base HP is affected.

---

## 🌟 Key Features

- **Real-time Multiplayer**: Low-overhead WebSockets for instant turn-sync.
- **Matchmaking Layer**:
  - **Quick Match**: Global FCFS queue for immediate play.
  - **Private Rooms**: 4-character shortcodes for playing with friends.
- **Evolution Mechanics**: Deep strategy involving unit "Molting" (Stage 1 -> 2 -> 3) and resource management.
- **Visual Feedback**: Real-time damage popups, combat logs, and animated state transitions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Svelte + Vite (HTML5 Canvas Rendering) |
| **Backend** | Node.js + TypeScript |
| **Networking** | WebSockets (`ws`) |
| **Logic** | Shared TypeScript Simulation Library |
| **Styling** | Vanilla CSS (Modern Fluid Design) |

---

## 🏗️ Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Installation & Run

1. **Clone & Install**:
   ```bash
   git clone https://github.com/fakeplastic-tree/catnip.git
   cd catnip
   npm install
   ```

2. **Launch Development Environment**:
   Starting from the root directory will launch both the frontend and backend concurrently:
   ```bash
   npm run dev
   ```

- **Client**: `http://localhost:5173`
- **Server**: `http://localhost:3000`

---

## 🗺️ Roadmap
- [ ] Account-based progression and persistent cat collections.
- [ ] Ranked matchmaking and elo system. 
- [ ] AI opponents for solo practice mode.
