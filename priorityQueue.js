/**
 * Min-Heap Priority Queue for optimal O(log N) graph searches (Dijkstra, A*, Greedy).
 */
export default class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(item, priority) {
        this.heap.push({ item, priority });
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.isEmpty()) return null;
        const top = this.heap[0].item;
        const bottom = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = bottom;
            this._sinkDown(0);
        }
        return top;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    _bubbleUp(index) {
        const element = this.heap[index];
        while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIdx];
            if (element.priority >= parent.priority) break;
            this.heap[index] = parent;
            this.heap[parentIdx] = element;
            index = parentIdx;
        }
    }

    _sinkDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];

        while (true) {
            let leftIdx = 2 * index + 1;
            let rightIdx = 2 * index + 2;
            let swapIdx = null;

            if (leftIdx < length) {
                if (this.heap[leftIdx].priority < element.priority) {
                    swapIdx = leftIdx;
                }
            }

            if (rightIdx < length) {
                const rightPriority = this.heap[rightIdx].priority;
                const comparePriority = swapIdx === null ? element.priority : this.heap[leftIdx].priority;
                if (rightPriority < comparePriority) {
                    swapIdx = rightIdx;
                }
            }

            if (swapIdx === null) break;

            this.heap[index] = this.heap[swapIdx];
            this.heap[swapIdx] = element;
            index = swapIdx;
        }
    }
}
