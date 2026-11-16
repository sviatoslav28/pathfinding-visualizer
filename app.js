import { CONFIG } from "./config.js";
import Grid from "./grid.js";
import { astar, dijkstra, bfs, dfs, greedy, bidirectional } from "./algorithms.js";
import {
    generateRecursiveDivision,
    generateRecursiveBacktracker,
    generateStairPattern,
    generateRandomObstacles
} from "./mazes.js";

// DOM Elements
const gridElement = document.querySelector("#grid");
const algorithmSelect = document.querySelector("#algorithm");
const mazeSelect = document.querySelector("#mazeSelect");
const speedSelect = document.querySelector("#speedSelect");
const startButton = document.querySelector("#startBtn");
const clearPathButton = document.querySelector("#clearPathBtn");
const clearBoardButton = document.querySelector("#clearBoardBtn");

// Stats elements
const visitedOutput = document.querySelector("#visited");
const pathOutput = document.querySelector("#path");
const costOutput = document.querySelector("#cost");
const timeOutput = document.querySelector("#time");
const statusBadge = document.querySelector("#statusBadge");

// Info card elements
const infoTitle = document.querySelector("#infoTitle");
const infoCategory = document.querySelector("#infoCategory");
const infoGuarantee = document.querySelector("#infoGuarantee");
const infoWeighted = document.querySelector("#infoWeighted");
const infoComplexity = document.querySelector("#infoComplexity");
const infoDescription = document.querySelector("#infoDescription");

// Tool selection buttons
const toolButtons = document.querySelectorAll(".tool-btn");

// Initialization
const grid = new Grid(gridElement);
let isRunning = false;
let abortRequested = false;
let hasVisualized = false;
let currentSpeed = CONFIG.DEFAULT_SPEED;

// Sleep utility
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// Mapping algorithms to functions
const algorithmMap = {
    astar,
    dijkstra,
    bfs,
    dfs,
    greedy,
    bidirectional
};

// ======================================
// Stats & Status Display
// ======================================
function setStats(visited = 0, path = 0, cost = 0, elapsed = 0) {
    visitedOutput.textContent = visited.toLocaleString();
    pathOutput.textContent = path.toLocaleString();
    costOutput.textContent = cost > 0 ? cost.toLocaleString() : path.toLocaleString();
    timeOutput.textContent = `${elapsed} ms`;
}

function setStatus(text, type = "idle") {
    statusBadge.textContent = text;
    statusBadge.className = `status-badge status-${type}`;
}

// ======================================
// Algorithm Information Card
// ======================================
function updateAlgorithmInfo() {
    const key = algorithmSelect.value;
    const algo = CONFIG.ALGORITHMS[key];
    if (!algo) return;

    infoTitle.textContent = algo.name;
    infoCategory.textContent = algo.category;
    infoGuarantee.textContent = algo.guaranteedShortest ? "Yes (Optimal)" : "No";
    infoGuarantee.className = algo.guaranteedShortest ? "badge-success" : "badge-neutral";
    infoWeighted.textContent = algo.weighted ? "Yes" : "No";
    infoWeighted.className = algo.weighted ? "badge-accent" : "badge-neutral";
    infoComplexity.textContent = `Time: ${algo.timeComplexity} | Space: ${algo.spaceComplexity}`;
    infoDescription.textContent = algo.description;
}

// ======================================
// UI State (Running vs Idle)
// ======================================
function setRunningState(running) {
    isRunning = running;
    const disabledControls = [
        algorithmSelect,
        mazeSelect,
        clearBoardButton,
        ...toolButtons
    ];

    disabledControls.forEach((el) => {
        if (el) el.disabled = running;
    });

    if (running) {
        startButton.textContent = "Stop";
        startButton.classList.add("btn-danger");
        gridElement.style.pointerEvents = "none";
        setStatus("Visualizing...", "running");
    } else {
        startButton.textContent = "Visualize";
        startButton.classList.remove("btn-danger");
        gridElement.style.pointerEvents = "";
    }
}

// ======================================
// Execution Engine
// ======================================
async function runVisualizer({ instant = false } = {}) {
    if (isRunning) return;

    abortRequested = false;
    grid.clearSearch();

    const algoKey = algorithmSelect.value;
    const algorithmFn = algorithmMap[algoKey];
    if (!algorithmFn) return;

    const speedConfig = CONFIG.SPEEDS[currentSpeed] || CONFIG.SPEEDS.fast;
    const isInstant = instant || currentSpeed === "instant";

    setRunningState(true);
    const startTime = performance.now();

    // Run the pathfinding algorithm
    const result = algorithmFn(grid, grid.startNode, grid.goalNode);
    const computeTime = Math.round(performance.now() - startTime);

    if (isInstant) {
        // Render instantly without delays
        for (const item of result.visitedOrder) {
            item.node.setVisited(true, item.secondary);
        }
        for (const node of result.path) {
            node.setPath(true);
        }
        const totalTime = Math.max(1, computeTime);
        setStats(result.visitedOrder.length, result.path.length, result.totalCost, totalTime);
        hasVisualized = true;
        setRunningState(false);
        if (result.success) {
            setStatus("Shortest Path Found!", "success");
        } else {
            setStatus("No Path Possible", "error");
        }
        return;
    }

    // Animated Visualization
    setStatus("Exploring Nodes...", "running");
    let batchSize = currentSpeed === "fast" ? 4 : currentSpeed === "slow" ? 1 : 2;

    for (let i = 0; i < result.visitedOrder.length; i++) {
        if (abortRequested) {
            setStatus("Visualization Stopped", "idle");
            setRunningState(false);
            return;
        }

        const item = result.visitedOrder[i];
        item.node.setVisited(true, item.secondary);

        if (i % batchSize === 0 || i === result.visitedOrder.length - 1) {
            const elapsed = Math.round(performance.now() - startTime);
            setStats(i + 1, 0, 0, elapsed);
            await sleep(speedConfig.visited);
        }
    }

    if (result.success) {
        setStatus("Drawing Path...", "running");
        for (let j = 0; j < result.path.length; j++) {
            if (abortRequested) {
                setStatus("Visualization Stopped", "idle");
                setRunningState(false);
                return;
            }
            result.path[j].setPath(true);
            const elapsed = Math.round(performance.now() - startTime);
            setStats(result.visitedOrder.length, j + 1, result.totalCost, elapsed);
            await sleep(speedConfig.path);
        }
        setStatus("Shortest Path Found!", "success");
    } else {
        setStatus("No Path Possible (Target Blocked)", "error");
    }

    const totalElapsed = Math.round(performance.now() - startTime);
    setStats(result.visitedOrder.length, result.path.length, result.totalCost, totalElapsed);

    hasVisualized = true;
    setRunningState(false);
}

// Stop visualization
function stopVisualization() {
    if (isRunning) {
        abortRequested = true;
    }
}

// ======================================
// Interactive Drag & Recalculate
// ======================================
grid.onGridChange = () => {
    if (hasVisualized && !isRunning) {
        // Instantly recalculate path when start/goal/walls change
        runVisualizer({ instant: true });
    }
};

// ======================================
// Maze Generation
// ======================================
async function handleMazeGeneration(type) {
    if (isRunning || !type) return;

    stopVisualization();
    grid.clearWalls();
    grid.clearWeights();
    grid.clearSearch();
    setStats(0, 0, 0, 0);
    hasVisualized = false;
    setStatus("Generating Maze...", "running");

    let walls = [];
    if (type === "recursive-division") {
        walls = generateRecursiveDivision(grid);
    } else if (type === "recursive-backtracker") {
        walls = generateRecursiveBacktracker(grid);
    } else if (type === "staircase") {
        walls = generateStairPattern(grid);
    } else if (type === "random") {
        walls = generateRandomObstacles(grid, 0.28);
    }

    // Animate wall placement
    const delay = currentSpeed === "slow" ? 15 : 6;
    const batch = currentSpeed === "slow" ? 2 : 5;

    for (let i = 0; i < walls.length; i++) {
        walls[i].setWall(true);
        if (i % batch === 0) {
            await sleep(delay);
        }
    }

    setStatus("Maze Ready", "idle");
    mazeSelect.value = "";
}

// ======================================
// Event Listeners
// ======================================
startButton.addEventListener("click", () => {
    if (isRunning) {
        stopVisualization();
    } else {
        runVisualizer();
    }
});

clearPathButton.addEventListener("click", () => {
    if (isRunning) return;
    grid.clearSearch();
    setStats(0, 0, 0, 0);
    hasVisualized = false;
    setStatus("Path Cleared (Walls Preserved)", "idle");
});

clearBoardButton.addEventListener("click", () => {
    if (isRunning) return;
    grid.reset();
    setStats(0, 0, 0, 0);
    hasVisualized = false;
    setStatus("Board Reset", "idle");
});

algorithmSelect.addEventListener("change", () => {
    updateAlgorithmInfo();
    if (hasVisualized && !isRunning) {
        runVisualizer({ instant: true });
    }
});

speedSelect.addEventListener("change", (e) => {
    currentSpeed = e.target.value;
});

mazeSelect.addEventListener("change", (e) => {
    handleMazeGeneration(e.target.value);
});

// Tool selector buttons
toolButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        toolButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        grid.activeTool = btn.dataset.tool;
    });
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
    if (e.target.matches("select, input, textarea")) return;

    if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) stopVisualization();
        else runVisualizer();
    } else if (e.key.toLowerCase() === "c") {
        if (!isRunning) {
            grid.clearSearch();
            setStats(0, 0, 0, 0);
            hasVisualized = false;
            setStatus("Path Cleared", "idle");
        }
    } else if (e.key.toLowerCase() === "r") {
        if (!isRunning) {
            grid.reset();
            setStats(0, 0, 0, 0);
            hasVisualized = false;
            setStatus("Board Reset", "idle");
        }
    } else if (e.key.toLowerCase() === "w") {
        const weightBtn = document.querySelector('[data-tool="weight"]');
        if (weightBtn) weightBtn.click();
    } else if (e.key.toLowerCase() === "q") {
        const wallBtn = document.querySelector('[data-tool="wall"]');
        if (wallBtn) wallBtn.click();
    } else if (e.key.toLowerCase() === "e") {
        const eraserBtn = document.querySelector('[data-tool="eraser"]');
        if (eraserBtn) eraserBtn.click();
    }
});

// Initial Setup
updateAlgorithmInfo();
setStatus("Ready", "idle");
setStats(0, 0, 0, 0);
