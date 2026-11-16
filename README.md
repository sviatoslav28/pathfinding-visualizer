<div align="center">

# 🧭 Pathfinding Visualizer

**An interactive, high-performance graph theory and pathfinding sandbox built with vanilla JavaScript.**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/Vanilla-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Modern-CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/Semantic-HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)](package.json)

[Live Demo](#live-demo) &bull; [Key Features](#key-features) &bull; [Algorithms](#supported-algorithms) &bull; [Mazes](#procedural-mazes) &bull; [Controls](#controls--shortcuts) &bull; [Quick Start](#getting-started)

</div>

---

## 🌟 Overview

**Pathfinding Visualizer** brings computer science graph traversal and heuristic search algorithms to life with silky-smooth animations, responsive grid interactions, and real-time execution statistics.

Explore how different algorithms navigate obstacles, weigh terrain costs, discover optimal routes, or escape complex mazes in real time.

---

## ⚡ Key Features

- **⚡ Real-Time Interactive Scrubbing**: Once a search has finished, drag the Start or Goal nodes across the grid—or paint walls on the fly—to watch the path recalculate instantaneously without delays.
- **🧠 6 Graph & Heuristic Algorithms**: Compare optimal vs greedy approaches, weighted vs unweighted methods, and single-source vs dual-frontier searches.
- **🌀 4 Procedural Maze & Pattern Generators**: Generate labyrinths and patterns using Recursive Division, Recursive Backtracker, Staircase, or Random Obstacles.
- **⚖️ Weighted Terrain Nodes**: Place weight nodes (cost: 5) to observe Dijkstra and A* smartly navigate around heavy terrain, while unweighted algorithms (BFS) take the brunt of the cost.
- **⏱️ Live Telemetry & Metrics**: Real-time counter of visited nodes, shortest path length, total path cost, and sub-millisecond execution times.
- **🎛️ Execution Controls**: Variable animation speeds (Fast, Normal, Slow, and 0ms Instant), with full Start/Stop cancellation at any moment.
- **🎨 Glassmorphic Cyber Dark UI**: Modern dark theme crafted with CSS backdrop filters, glowing states, pulsing markers, and full responsive design.
- **🚀 Zero Build Step**: 100% pure vanilla HTML5, CSS3, and modern modular ES6 JavaScript. No bundlers or dependencies required.

---

## 🔬 Supported Algorithms

| Algorithm | Category | Guarantees Shortest Path? | Supports Weights? | Time Complexity | Space Complexity |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **A\* Search** | Heuristic Search | **Yes (Optimal)** | **Yes** | $O(E \log V)$ | $O(V)$ |
| **Dijkstra's Algorithm** | Uniform-Cost Search | **Yes (Optimal)** | **Yes** | $O((V + E) \log V)$ | $O(V)$ |
| **Breadth-First Search (BFS)** | Level-Order Traversal | **Yes (Unweighted)** | No | $O(V + E)$ | $O(V)$ |
| **Depth-First Search (DFS)** | Depth Traversal | No | No | $O(V + E)$ | $O(V)$ |
| **Greedy Best-First Search** | Pure Heuristic | No | No | $O(E \log V)$ | $O(V)$ |
| **Bidirectional BFS** | Dual-Frontier Search | **Yes (Unweighted)** | No | $O(b^{d/2})$ | $O(b^{d/2})$ |

> **Under the hood**: Dijkstra, A\*, and Greedy algorithms utilize a custom, high-efficiency Binary Min-Heap Priority Queue (`PriorityQueue`), guaranteeing true $O(\log N)$ extraction and insertion.

---

## 🧩 Procedural Mazes

- **Recursive Division**: Divides chambers recursively with horizontal and vertical walls, carving guaranteed passages to create structured corridors.
- **Recursive Backtracker**: Carves an intricate, loop-free labyrinth (perfect maze) starting from the origin and backtracking along dead ends.
- **Staircase Pattern**: Places diagonal obstacle walls to test diagonal navigation limits.
- **Random Obstacles**: Generates scattered obstacles with a controlled distribution (~28% density).

---

## ⌨️ Controls & Shortcuts

| Action | Control / Shortcut | Description |
| :--- | :--- | :--- |
| **Draw Wall / Weight** | `Left Click + Drag` | Paint selected tool onto the grid |
| **Move Start / Goal** | `Click & Drag Marker` | Reposition the Start (Green) or Goal (Red) |
| **Erase** | `Right Click + Drag` | Erase walls and weights quickly |
| **Start / Stop** | <kbd>Space</kbd> | Run the visualization or cancel execution |
| **Select Weight Tool** | <kbd>W</kbd> | Switch to Weight tool (Cost: 5) |
| **Select Wall Tool** | <kbd>Q</kbd> | Switch to Wall tool |
| **Select Eraser Tool** | <kbd>E</kbd> | Switch to Eraser tool |
| **Clear Path** | <kbd>C</kbd> | Clear visited search & path (keeps walls & weights) |
| **Clear Board** | <kbd>R</kbd> | Reset the entire grid to defaults |

---

## 📁 Project Structure

```text
Pathfinding visualizator/
├── index.html            # Main markup with semantic panels & toolbar
├── style.css             # Glassmorphism dark mode & keyframe animations
├── app.js                # Core app controller, animation loop & interactive state
├── grid.js               # Grid data structure, coordinate mapping & event dispatcher
├── node.js               # Reactive Node model with state flags & DOM render
├── algorithms.js         # A*, Dijkstra, BFS, DFS, Greedy, Bidirectional BFS
├── priorityQueue.js      # Binary Min-Heap Priority Queue implementation
├── mazes.js              # Recursive Division, Backtracker, Staircase, Random
├── config.js             # Global dimensions, delays, colors, and complexity specs
├── pv-favicon.svg        # Scalable vector favicon
├── pv-favicon.ico        # Legacy icon
├── pv-favicon.jpg        # Icon preview
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Local Setup (Zero Installation Required)

Because this project is built with standard ES6 modules, you can serve it with any local static HTTP server:

#### Option 1: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.

#### Option 2: Python HTTP Server
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

#### Option 3: Node `npx serve`
```bash
npx serve .
```

---

## 🌐 Deploying to GitHub Pages

You can host this project on GitHub Pages in under a minute:

1. Push your code to your GitHub repository (see below).
2. Go to your repository on GitHub: **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` and `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **Sviatoslav Bayer**.
