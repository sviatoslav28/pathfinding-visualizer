/**
 * Procedural Maze & Pattern Generators
 */

/**
 * Recursive Division Maze
 * Builds walls recursively with single openings, creating structured maze corridors.
 */
export function generateRecursiveDivision(grid) {
    const walls = [];

    // Add surrounding perimeter walls
    for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
            if (r === 0 || r === grid.rows - 1 || c === 0 || c === grid.cols - 1) {
                const node = grid.getNode(r, c);
                if (!node.isStart && !node.isGoal) walls.push(node);
            }
        }
    }

    function divide(rStart, rEnd, cStart, cEnd, orientation) {
        if (rEnd - rStart < 2 || cEnd - cStart < 2) return;

        const isHorizontal = orientation === "horizontal";

        // Determine wall coordinate (must be even for clean grid channels)
        let wallRow = isHorizontal
            ? rStart + 1 + Math.floor(Math.random() * ((rEnd - rStart - 1) / 2)) * 2
            : null;
        let wallCol = !isHorizontal
            ? cStart + 1 + Math.floor(Math.random() * ((cEnd - cStart - 1) / 2)) * 2
            : null;

        if (isHorizontal) {
            // Pick a random passage hole (odd index)
            const passageCol = cStart + Math.floor(Math.random() * ((cEnd - cStart + 1) / 2)) * 2;
            for (let c = cStart; c <= cEnd; c++) {
                if (c !== passageCol) {
                    const node = grid.getNode(wallRow, c);
                    if (node && !node.isStart && !node.isGoal) walls.push(node);
                }
            }
            divide(rStart, wallRow - 1, cStart, cEnd, chooseOrientation(wallRow - 1 - rStart, cEnd - cStart));
            divide(wallRow + 1, rEnd, cStart, cEnd, chooseOrientation(rEnd - (wallRow + 1), cEnd - cStart));
        } else {
            // Pick a random passage hole
            const passageRow = rStart + Math.floor(Math.random() * ((rEnd - rStart + 1) / 2)) * 2;
            for (let r = rStart; r <= rEnd; r++) {
                if (r !== passageRow) {
                    const node = grid.getNode(r, wallCol);
                    if (node && !node.isStart && !node.isGoal) walls.push(node);
                }
            }
            divide(rStart, rEnd, cStart, wallCol - 1, chooseOrientation(rEnd - rStart, wallCol - 1 - cStart));
            divide(rStart, rEnd, wallCol + 1, cEnd, chooseOrientation(rEnd - rStart, cEnd - (wallCol + 1)));
        }
    }

    function chooseOrientation(width, height) {
        if (width < height) return "vertical";
        if (height < width) return "horizontal";
        return Math.random() < 0.5 ? "horizontal" : "vertical";
    }

    divide(1, grid.rows - 2, 1, grid.cols - 2, chooseOrientation(grid.rows - 2, grid.cols - 2));

    return walls;
}

/**
 * Recursive Backtracker Maze
 * Creates a winding labyrinth. Fills non-passages with walls.
 */
export function generateRecursiveBacktracker(grid) {
    const visited = new Set();
    const walls = new Set();

    // Start with all interior nodes as walls
    for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
            const node = grid.getNode(r, c);
            if (!node.isStart && !node.isGoal) {
                walls.add(node);
            }
        }
    }

    // Carve passages from start position (or nearest odd row/col)
    const startR = grid.startNode.row % 2 === 1 ? grid.startNode.row : Math.max(1, grid.startNode.row - 1);
    const startC = grid.startNode.col % 2 === 1 ? grid.startNode.col : Math.max(1, grid.startNode.col - 1);

    const stack = [[startR, startC]];
    visited.add(`${startR},${startC}`);
    const startNode = grid.getNode(startR, startC);
    if (startNode) walls.delete(startNode);

    const directions = [
        [-2, 0, -1, 0], // Up
        [2, 0, 1, 0],   // Down
        [0, -2, 0, -1], // Left
        [0, 2, 0, 1]    // Right
    ];

    while (stack.length > 0) {
        const [cr, cc] = stack[stack.length - 1];
        const unvisitedNeighbors = [];

        // Shuffle directions
        const shuffled = [...directions].sort(() => Math.random() - 0.5);

        for (const [dr, dc, wr, wc] of shuffled) {
            const nr = cr + dr;
            const nc = cc + dc;

            if (nr >= 1 && nr < grid.rows - 1 && nc >= 1 && nc < grid.cols - 1) {
                if (!visited.has(`${nr},${nc}`)) {
                    unvisitedNeighbors.push({ nr, nc, wr: cr + wr, wc: cc + wc });
                }
            }
        }

        if (unvisitedNeighbors.length > 0) {
            const { nr, nc, wr, wc } = unvisitedNeighbors[0];
            visited.add(`${nr},${nc}`);

            const wallNode = grid.getNode(wr, wc);
            const nextNode = grid.getNode(nr, nc);

            if (wallNode) walls.delete(wallNode);
            if (nextNode) walls.delete(nextNode);

            stack.push([nr, nc]);
        } else {
            stack.pop();
        }
    }

    // Ensure start and goal neighbors are walkable
    for (const neighbor of grid.getNeighbors(grid.startNode)) walls.delete(neighbor);
    for (const neighbor of grid.getNeighbors(grid.goalNode)) walls.delete(neighbor);
    walls.delete(grid.startNode);
    walls.delete(grid.goalNode);

    return Array.from(walls);
}

/**
 * Simple Staircase Pattern
 */
export function generateStairPattern(grid) {
    const walls = [];
    let r = grid.rows - 2;
    let c = 1;

    while (r > 0 && c < grid.cols - 1) {
        const node = grid.getNode(r, c);
        if (node && !node.isStart && !node.isGoal) {
            walls.push(node);
        }
        r--;
        c++;
    }

    r = 1;
    c = Math.floor(grid.cols / 2);
    while (r < grid.rows - 1 && c < grid.cols - 1) {
        const node = grid.getNode(r, c);
        if (node && !node.isStart && !node.isGoal) {
            walls.push(node);
        }
        r++;
        c++;
    }

    return walls;
}

/**
 * Random Obstacle Generator
 */
export function generateRandomObstacles(grid, density = 0.28) {
    const walls = [];
    for (const node of grid.getAllNodes()) {
        if (!node.isStart && !node.isGoal && Math.random() < density) {
            walls.push(node);
        }
    }
    return walls;
}
