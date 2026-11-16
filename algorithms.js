import PriorityQueue from "./priorityQueue.js";

// Manhattan distance heuristic
const manhattanDistance = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

// Reconstruct path from Goal back to Start
function reconstructPath(goalNode) {
    const path = [];
    let current = goalNode.parent;
    while (current && !current.isStart) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}

// Calculate total path cost (considering node weights)
function calculatePathCost(path) {
    if (!path || path.length === 0) return 0;
    // Step from start to first path node is 1, each node has getCost(), plus step to goal is 1
    let cost = 1; // start to path[0]
    for (const node of path) {
        cost += node.getCost();
    }
    return cost;
}

/**
 * A* Pathfinding Algorithm
 * Uses PriorityQueue with slight tie-breaking factor towards goal.
 */
export function astar(grid, start, goal) {
    const pq = new PriorityQueue();
    const visitedOrder = [];
    const closedSet = new Set();

    start.g = 0;
    start.h = manhattanDistance(start, goal);
    start.f = start.g + start.h;

    pq.push(start, start.f);

    while (!pq.isEmpty()) {
        const current = pq.pop();

        if (closedSet.has(current)) continue;
        closedSet.add(current);

        if (current === goal) {
            const path = reconstructPath(goal);
            return {
                visitedOrder,
                path,
                totalCost: calculatePathCost(path),
                success: true
            };
        }

        if (!current.isStart) {
            visitedOrder.push({ node: current, secondary: false });
        }

        for (const neighbor of grid.getNeighbors(current)) {
            if (closedSet.has(neighbor)) continue;

            const tentativeG = current.g + neighbor.getCost();

            if (tentativeG < neighbor.g) {
                neighbor.parent = current;
                neighbor.g = tentativeG;
                neighbor.h = manhattanDistance(neighbor, goal);
                // Slight tie-breaker multiplier (1.001) prefers paths closer to goal
                neighbor.f = neighbor.g + neighbor.h * 1.001;
                pq.push(neighbor, neighbor.f);
            }
        }
    }

    return { visitedOrder, path: [], totalCost: 0, success: false };
}

/**
 * Dijkstra's Algorithm
 * Optimal uniform-cost search on non-negative weighted graphs.
 */
export function dijkstra(grid, start, goal) {
    const pq = new PriorityQueue();
    const visitedOrder = [];
    const closedSet = new Set();

    start.g = 0;
    pq.push(start, 0);

    while (!pq.isEmpty()) {
        const current = pq.pop();

        if (closedSet.has(current)) continue;
        closedSet.add(current);

        if (current === goal) {
            const path = reconstructPath(goal);
            return {
                visitedOrder,
                path,
                totalCost: calculatePathCost(path),
                success: true
            };
        }

        if (!current.isStart) {
            visitedOrder.push({ node: current, secondary: false });
        }

        for (const neighbor of grid.getNeighbors(current)) {
            if (closedSet.has(neighbor)) continue;

            const tentativeG = current.g + neighbor.getCost();

            if (tentativeG < neighbor.g) {
                neighbor.parent = current;
                neighbor.g = tentativeG;
                pq.push(neighbor, tentativeG);
            }
        }
    }

    return { visitedOrder, path: [], totalCost: 0, success: false };
}

/**
 * Breadth-First Search (BFS)
 * Unweighted shortest-path exploration.
 */
export function bfs(grid, start, goal) {
    const queue = [start];
    const visitedOrder = [];
    const seen = new Set([start]);

    while (queue.length > 0) {
        const current = queue.shift();

        if (current === goal) {
            const path = reconstructPath(goal);
            return {
                visitedOrder,
                path,
                totalCost: calculatePathCost(path),
                success: true
            };
        }

        if (!current.isStart) {
            visitedOrder.push({ node: current, secondary: false });
        }

        for (const neighbor of grid.getNeighbors(current)) {
            if (!seen.has(neighbor)) {
                seen.add(neighbor);
                neighbor.parent = current;
                queue.push(neighbor);
            }
        }
    }

    return { visitedOrder, path: [], totalCost: 0, success: false };
}

/**
 * Depth-First Search (DFS)
 * Explores deep down paths before backtracking. Non-optimal.
 */
export function dfs(grid, start, goal) {
    const stack = [start];
    const visitedOrder = [];
    const visited = new Set();

    while (stack.length > 0) {
        const current = stack.pop();

        if (visited.has(current)) continue;
        visited.add(current);

        if (current === goal) {
            const path = reconstructPath(goal);
            return {
                visitedOrder,
                path,
                totalCost: calculatePathCost(path),
                success: true
            };
        }

        if (!current.isStart) {
            visitedOrder.push({ node: current, secondary: false });
        }

        // Push neighbors in reverse order to explore in intuitive direction
        const neighbors = grid.getNeighbors(current);
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visited.has(neighbor)) {
                neighbor.parent = current;
                stack.push(neighbor);
            }
        }
    }

    return { visitedOrder, path: [], totalCost: 0, success: false };
}

/**
 * Greedy Best-First Search
 * Expands nodes strictly closest to goal according to heuristic (h). Non-optimal.
 */
export function greedy(grid, start, goal) {
    const pq = new PriorityQueue();
    const visitedOrder = [];
    const visited = new Set();

    start.h = manhattanDistance(start, goal);
    pq.push(start, start.h);

    while (!pq.isEmpty()) {
        const current = pq.pop();

        if (visited.has(current)) continue;
        visited.add(current);

        if (current === goal) {
            const path = reconstructPath(goal);
            return {
                visitedOrder,
                path,
                totalCost: calculatePathCost(path),
                success: true
            };
        }

        if (!current.isStart) {
            visitedOrder.push({ node: current, secondary: false });
        }

        for (const neighbor of grid.getNeighbors(current)) {
            if (!visited.has(neighbor)) {
                neighbor.parent = current;
                neighbor.h = manhattanDistance(neighbor, goal);
                pq.push(neighbor, neighbor.h);
            }
        }
    }

    return { visitedOrder, path: [], totalCost: 0, success: false };
}

/**
 * Bidirectional Breadth-First Search
 * Expands simultaneously from Start and Goal until frontiers meet.
 */
export function bidirectional(grid, start, goal) {
    const queueStart = [start];
    const queueGoal = [goal];

    const visitedStart = new Map([[start, null]]);
    const visitedGoal = new Map([[goal, null]]);

    const visitedOrder = [];
    let intersection = null;

    while (queueStart.length > 0 && queueGoal.length > 0) {
        // Expand forward
        const currentStart = queueStart.shift();
        if (!currentStart.isStart && currentStart !== goal) {
            visitedOrder.push({ node: currentStart, secondary: false });
        }

        for (const neighbor of grid.getNeighbors(currentStart)) {
            if (!visitedStart.has(neighbor)) {
                visitedStart.set(neighbor, currentStart);
                neighbor.parent = currentStart;
                queueStart.push(neighbor);

                if (visitedGoal.has(neighbor)) {
                    intersection = neighbor;
                    break;
                }
            }
        }
        if (intersection) break;

        // Expand backward
        const currentGoal = queueGoal.shift();
        if (!currentGoal.isGoal && currentGoal !== start) {
            visitedOrder.push({ node: currentGoal, secondary: true });
        }

        for (const neighbor of grid.getNeighbors(currentGoal)) {
            if (!visitedGoal.has(neighbor)) {
                visitedGoal.set(neighbor, currentGoal);
                neighbor.parentReverse = currentGoal;
                queueGoal.push(neighbor);

                if (visitedStart.has(neighbor)) {
                    intersection = neighbor;
                    break;
                }
            }
        }
        if (intersection) break;
    }

    if (!intersection) {
        return { visitedOrder, path: [], totalCost: 0, success: false };
    }

    // Reconstruct path from Start -> Intersection -> Goal
    const path = [];

    // Start -> Intersection
    let curr = intersection;
    while (curr && !curr.isStart) {
        if (curr !== intersection) path.unshift(curr);
        curr = visitedStart.get(curr);
    }

    path.push(intersection);

    // Intersection -> Goal
    curr = visitedGoal.get(intersection);
    while (curr && !curr.isGoal) {
        path.push(curr);
        curr = visitedGoal.get(curr);
    }

    return {
        visitedOrder,
        path,
        totalCost: calculatePathCost(path),
        success: true
    };
}
