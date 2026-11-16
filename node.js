import { CONFIG } from "./config.js";

export default class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.element = null;

        this.isWall = false;
        this.isWeight = false;
        this.isStart = false;
        this.isGoal = false;

        this.visited = false;
        this.visitedSecondary = false;
        this.inPath = false;

        this.parent = null;
        this.parentReverse = null;

        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
    }

    // ==========================
    // DOM Element Attachment
    // ==========================
    attachElement(element) {
        this.element = element;
        this.render();
    }

    // ==========================
    // State Setters
    // ==========================
    setStart(value = true) {
        this.isStart = value;
        if (value) {
            this.isWall = false;
            this.isWeight = false;
        }
        this.render();
    }

    setGoal(value = true) {
        this.isGoal = value;
        if (value) {
            this.isWall = false;
            this.isWeight = false;
        }
        this.render();
    }

    setWall(value = true) {
        if (this.isStart || this.isGoal) return;
        this.isWall = value;
        if (value) {
            this.isWeight = false;
        }
        this.render();
    }

    setWeight(value = true) {
        if (this.isStart || this.isGoal) return;
        this.isWeight = value;
        if (value) {
            this.isWall = false;
        }
        this.render();
    }

    toggleWall() {
        if (this.isStart || this.isGoal) return;
        this.setWall(!this.isWall);
    }

    toggleWeight() {
        if (this.isStart || this.isGoal) return;
        this.setWeight(!this.isWeight);
    }

    setVisited(value = true, isSecondary = false) {
        if (this.isStart || this.isGoal) return;
        this.visited = value;
        this.visitedSecondary = isSecondary;
        this.render();
    }

    setPath(value = true) {
        if (this.isStart || this.isGoal) return;
        this.inPath = value;
        this.render();
    }

    clearSearch() {
        this.visited = false;
        this.visitedSecondary = false;
        this.inPath = false;
        this.parent = null;
        this.parentReverse = null;
        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
        this.render();
    }

    reset() {
        this.isWall = false;
        this.isWeight = false;
        this.isStart = false;
        this.isGoal = false;
        this.clearSearch();
    }

    // ==========================
    // Helpers
    // ==========================
    isWalkable() {
        return !this.isWall;
    }

    getCost() {
        return this.isWeight ? CONFIG.WEIGHT_COST : 1;
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }

    // ==========================
    // Rendering
    // ==========================
    render() {
        if (!this.element) return;

        const classes = ["cell"];

        if (this.isWall) classes.push(CONFIG.COLORS.WALL);
        if (this.isWeight) classes.push(CONFIG.COLORS.WEIGHT);
        if (this.visited) {
            classes.push(this.visitedSecondary ? CONFIG.COLORS.VISITED_2 : CONFIG.COLORS.VISITED);
        }
        if (this.inPath) classes.push(CONFIG.COLORS.PATH);
        if (this.isStart) classes.push(CONFIG.COLORS.START);
        if (this.isGoal) classes.push(CONFIG.COLORS.GOAL);

        this.element.className = classes.join(" ");
    }
}
