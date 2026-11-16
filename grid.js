import { CONFIG } from "./config.js";
import Node from "./node.js";

export default class Grid {
    constructor(container) {
        this.container = container;
        this.nodes = [];
        this.rows = CONFIG.ROWS;
        this.cols = CONFIG.COLS;

        this.startNode = null;
        this.goalNode = null;

        // Interaction state
        this.activeTool = "wall"; // "wall", "weight", "eraser"
        this.isPointerDown = false;
        this.isDraggingStart = false;
        this.isDraggingGoal = false;
        this.dragPaintMode = null; // true = add, false = remove

        // Callback for interactive instant re-calculation
        this.onGridChange = null;

        this.createGrid();
        this.attachEvents();
    }

    // ======================================
    // Create Grid
    // ======================================
    createGrid() {
        this.container.innerHTML = "";
        this.container.style.gridTemplateColumns = `repeat(${this.cols}, ${CONFIG.CELL_SIZE}px)`;
        this.nodes = [];

        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                const node = new Node(row, col);
                const cell = document.createElement("div");

                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;

                node.attachElement(cell);
                this.container.appendChild(cell);
                currentRow.push(node);
            }
            this.nodes.push(currentRow);
        }

        // Set default Start and Goal
        this.startNode = this.getNode(CONFIG.START.row, CONFIG.START.col);
        this.goalNode = this.getNode(CONFIG.GOAL.row, CONFIG.GOAL.col);

        this.startNode.setStart(true);
        this.goalNode.setGoal(true);
    }

    // ======================================
    // Getters
    // ======================================
    getNode(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.nodes[row][col];
    }

    getAllNodes() {
        return this.nodes.flat();
    }

    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            [-1, 0], // Up
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1]   // Right
        ];

        for (const [dr, dc] of directions) {
            const neighbor = this.getNode(node.row + dr, node.col + dc);
            if (!neighbor) continue;
            if (!neighbor.isWalkable()) continue;
            neighbors.push(neighbor);
        }

        return neighbors;
    }

    // ======================================
    // Clear and Reset Handlers
    // ======================================
    clearSearch() {
        for (const node of this.getAllNodes()) {
            node.clearSearch();
        }
        this.startNode.setStart(true);
        this.goalNode.setGoal(true);
    }

    clearWalls() {
        for (const node of this.getAllNodes()) {
            if (node.isWall) {
                node.setWall(false);
            }
        }
        this.clearSearch();
        this._notifyChange();
    }

    clearWeights() {
        for (const node of this.getAllNodes()) {
            if (node.isWeight) {
                node.setWeight(false);
            }
        }
        this.clearSearch();
        this._notifyChange();
    }

    reset() {
        for (const node of this.getAllNodes()) {
            node.reset();
        }
        this.startNode = this.getNode(CONFIG.START.row, CONFIG.START.col);
        this.goalNode = this.getNode(CONFIG.GOAL.row, CONFIG.GOAL.col);
        this.startNode.setStart(true);
        this.goalNode.setGoal(true);
        this._notifyChange();
    }

    // ======================================
    // Event Listeners
    // ======================================
    attachEvents() {
        // Pointer down
        const handlePointerStart = (event) => {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            const node = this.getNode(row, col);
            if (!node) return;

            this.isPointerDown = true;

            // Check if dragging Start or Goal
            if (node === this.startNode) {
                this.isDraggingStart = true;
                return;
            }
            if (node === this.goalNode) {
                this.isDraggingGoal = true;
                return;
            }

            // Right click is always eraser
            if (event.button === 2 || this.activeTool === "eraser") {
                node.setWall(false);
                node.setWeight(false);
                this.dragPaintMode = "erase";
                this._notifyChange();
                return;
            }

            if (this.activeTool === "weight") {
                this.dragPaintMode = !node.isWeight;
                node.setWeight(this.dragPaintMode);
                this._notifyChange();
                return;
            }

            // Default tool: Wall
            this.dragPaintMode = !node.isWall;
            node.setWall(this.dragPaintMode);
            this._notifyChange();
        };

        // Pointer move
        const handlePointerMove = (event) => {
            if (!this.isPointerDown) return;

            // Touch support elementFromPoint
            let target = event.target;
            if (event.touches && event.touches.length > 0) {
                const touch = event.touches[0];
                target = document.elementFromPoint(touch.clientX, touch.clientY);
            }

            const cell = target?.closest(".cell");
            if (!cell) return;

            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            const node = this.getNode(row, col);
            if (!node) return;

            // Dragging Start
            if (this.isDraggingStart) {
                if (node.isWall || node === this.goalNode) return;
                this.startNode.setStart(false);
                this.startNode = node;
                this.startNode.setStart(true);
                this._notifyChange();
                return;
            }

            // Dragging Goal
            if (this.isDraggingGoal) {
                if (node.isWall || node === this.startNode) return;
                this.goalNode.setGoal(false);
                this.goalNode = node;
                this.goalNode.setGoal(true);
                this._notifyChange();
                return;
            }

            // Painting
            if (node === this.startNode || node === this.goalNode) return;

            if (this.dragPaintMode === "erase") {
                node.setWall(false);
                node.setWeight(false);
                this._notifyChange();
            } else if (this.activeTool === "weight") {
                node.setWeight(this.dragPaintMode);
                this._notifyChange();
            } else {
                node.setWall(this.dragPaintMode);
                this._notifyChange();
            }
        };

        // Pointer end
        const handlePointerEnd = () => {
            this.isPointerDown = false;
            this.isDraggingStart = false;
            this.isDraggingGoal = false;
            this.dragPaintMode = null;
        };

        // Attach mouse events
        this.container.addEventListener("mousedown", handlePointerStart);
        this.container.addEventListener("mouseover", handlePointerMove);
        window.addEventListener("mouseup", handlePointerEnd);

        // Attach touch events for mobile/tablets
        this.container.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) handlePointerStart(e);
        }, { passive: false });

        this.container.addEventListener("touchmove", (e) => {
            if (this.isPointerDown && e.touches.length === 1) {
                e.preventDefault();
                handlePointerMove(e);
            }
        }, { passive: false });

        window.addEventListener("touchend", handlePointerEnd);

        // Prevent context menu
        this.container.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    _notifyChange() {
        if (typeof this.onGridChange === "function") {
            this.onGridChange();
        }
    }
}
