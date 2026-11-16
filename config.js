export const CONFIG = {
    // Grid Dimensions
    ROWS: 23,
    COLS: 47,
    CELL_SIZE: 22,

    // Weight Cost
    WEIGHT_COST: 5,

    // Animation Speeds (in milliseconds)
    SPEEDS: {
        instant: { visited: 0, path: 0, label: "Instant" },
        fast: { visited: 4, path: 12, label: "Fast" },
        normal: { visited: 14, path: 25, label: "Normal" },
        slow: { visited: 35, path: 55, label: "Slow" }
    },

    // Default Animation
    DEFAULT_SPEED: "fast",

    // CSS Class Names
    COLORS: {
        WALL: "wall",
        START: "start",
        GOAL: "goal",
        VISITED: "visited",
        VISITED_2: "visited-secondary",
        PATH: "path",
        WEIGHT: "weight"
    },

    // Default Positions
    START: {
        row: 11,
        col: 8
    },

    GOAL: {
        row: 11,
        col: 38
    },

    // Algorithms details & theoretical properties
    ALGORITHMS: {
        astar: {
            name: "A* Search",
            category: "Heuristic Search",
            guaranteedShortest: true,
            weighted: true,
            timeComplexity: "O(E log V)",
            spaceComplexity: "O(V)",
            description: "A* combines the exact cost from the start node (g) with an admissible heuristic estimate to the goal (h). Uses an optimal priority queue with tie-breaking to achieve optimal paths with minimal explored area."
        },
        dijkstra: {
            name: "Dijkstra's Algorithm",
            category: "Uniform Cost Search",
            guaranteedShortest: true,
            weighted: true,
            timeComplexity: "O((V + E) log V)",
            spaceComplexity: "O(V)",
            description: "Dijkstra's algorithm expands outward uniformly based on the exact path distance from the start. It guarantees the absolute shortest path on any non-negative weighted graph."
        },
        bfs: {
            name: "Breadth-First Search (BFS)",
            category: "Unweighted Graph Traversal",
            guaranteedShortest: true,
            weighted: false,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            description: "BFS explores all neighboring nodes level-by-level before advancing deeper. It guarantees the shortest path in terms of number of steps on unweighted graphs (ignores weights)."
        },
        dfs: {
            name: "Depth-First Search (DFS)",
            category: "Unweighted Graph Traversal",
            guaranteedShortest: false,
            weighted: false,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            description: "DFS plunges as deeply as possible along each branch before backtracking. It does not guarantee shortest paths and can produce long winding routes, but requires minimal memory."
        },
        greedy: {
            name: "Greedy Best-First Search",
            category: "Pure Heuristic Search",
            guaranteedShortest: false,
            weighted: false,
            timeComplexity: "O(E log V)",
            spaceComplexity: "O(V)",
            description: "Greedy Best-First Search expands nodes solely based on their estimated distance to the goal (h). It is exceptionally fast in open fields, but can get trapped by concave obstacles and does not guarantee shortest paths."
        },
        bidirectional: {
            name: "Bidirectional BFS",
            category: "Dual-Frontier Search",
            guaranteedShortest: true,
            weighted: false,
            timeComplexity: "O(b^(d/2))",
            spaceComplexity: "O(b^(d/2))",
            description: "Bidirectional BFS initiates two simultaneous searches—one forward from Start, one backward from Goal—meeting in the middle. Drastically reduces explored node count."
        }
    }
};
