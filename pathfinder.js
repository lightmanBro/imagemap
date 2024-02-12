function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const priorityQueue = new PriorityQueue();

    // Initialize distances to infinity and previous nodes to null
    for (let node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;

    // Add the starting node to the priority queue with priority 0
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();

        // Stop if we've reached the end node
        if (current === end) {
            const path = [];
            let currentNode = end;
            while (currentNode !== null) {
                path.unshift(currentNode);
                currentNode = previous[currentNode];
            }
            return path;
        }

        // Explore neighbors
        for (let neighbor in graph[current]) {
            const distance = distances[current] + graph[current][neighbor];
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = current;
                priorityQueue.enqueue(neighbor, distance);
            }
        }
    }

    // No path found
    return [];
}

// Priority queue implementation (min heap)
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().item;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// Example usage
const graph = {
    '1228,530': { '4165,530': 1 },
    '4165,530': { '1228,530': 1, '4165,811': 1 },
    '4165,811': { '4165,530': 1, '1384,811': 1 },
    '1384,811': { '4165,811': 1, '3646,811': 1 },
    '3646,811': { '1384,811': 1, '3496,1384': 1 },
    '3496,1384': { '3646,811': 1, '3496,2069': 1 },
    '3496,2069': { '3496,1384': 1 }
};

const start = '1228,530';
const end = '3496,2069';

const shortestPath = dijkstra(graph, start, end);
console.log('Shortest path:', shortestPath);
function convertToCoordinates(shortestPath) {
    const coordinates = [];
    for (let i = 0; i < shortestPath.length - 1; i++) {
        const [x1, y1] = shortestPath[i].split(',').map(Number);
        const [x2, y2] = shortestPath[i + 1].split(',').map(Number);
        coordinates.push({ x1, y1, x2, y2 });
    }
    return coordinates;
}


// Example usage
// const shortestPath = ['1228,530', '4165,530', '4165,811', '1384,811', '3646,811', '3496,1384', '3496,2069'];
const pathCoordinates = convertToCoordinates(shortestPath);
console.log('Path coordinates:', pathCoordinates);



// const coordinates = [
    //     { x1: 1134, y1: 474, x2: 3678, y2: 474 }, // 5520 - 5500
    //     { x1: 3678, y1: 464, x2: 3678, y2: 720 }, // Wrkst 5544-5545
    //     { x1: 3678, y1: 720, x2: 1150, y2: 720 }, // 5525- wrkst 5545
    //     { x1: 3200, y1: 720, x2: 4428, y2: 1093 }, // 5541 - corridor C5001
    //     { x1: 3220, y1: 720, x2: 3084, y2: 1232 }, // 5541 - corridor C5000
    //     { x1: 3515, y1: 818, x2: 3366, y2: 1318 }, // corridor C5002
    //     { x1: 4175, y1: 1021, x2: 4029, y2: 1533 }, // corridor C5002
    //     { x1: 4029, y1: 1533, x2: 3862, y2: 2099 }, // corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
    //     { x1: 3805, y1: 1474, x2: 3628, y2: 2036 }, // C5000 via Elevator lobby Elevator 4 - 11
    //     { x1: 1143, y1: 1463, x2: 2885, y2: 1453 }, // 5580 - coorodor C5560
    //     { x1: 3021, y1: 1461, x2: 2918, y2: 1847 }, // closet 5404 via corridor C5400 via corridor C5405
    //     { x1: 2918, y1: 1847, x2: 3430, y2: 1984 }, // corridor C5405
    //     { x1: 3430, y1: 1984, x2: 4123, y2: 2182 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 4123, y1: 2182, x2: 4272, y2: 1624 }, // Junction of 5208,5108 corridor C5100
    //     { x1: 3084, y1: 1232, x2: 4274, y2: 1618 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 4428, y1: 1093, x2: 4274, y2: 1618 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 1142, y1: 1200, x2: 2888, y2: 1199 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 2888, y1: 1199, x2: 2886, y2: 1461 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 2886, y1: 1461, x2: 3023, y2: 1461 }, // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    //     { x1: 3084, y1: 1232, x2: 3023, y2: 1461 } // corridor C5405 - C5100 via elevator 1-5PE7 corridor
    // ];


    
    /*
    To implement the direction on the map we need to use
     (beginning)-> Where the user wants to move from.
      (via)-> [arrays of coordinates that the route is on]
     (End)-> The final destination of the user, either the name of the office or the number of the office.
    */
    // //5520 - 5500
    // drawLine2(1134, 474, 3678, 474);
    // //Wrkst 5544-5545
    // drawLine2(3678, 464, 3678, 720)
    // //5525- wrkst 5545
    // drawLine2(3678, 720, 1150, 720);
    // //5541 - corridor C5001
    // drawLine2(3200, 720, 4428, 1093)
    // //5541 - corridor C5000
    // drawLine2(3220, 720, 3084, 1232)
    // //corridor C5002
    // drawLine2(3515, 818, 3366, 1318)
    // drawLine2(4175, 1021, 4029, 1533);
    // //corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
    // drawLine2(4029, 1533, 3862, 2099);
    // //C5000 via Elevator lobby Elevator 4 - 11
    // drawLine2(3805, 1474, 3628, 2036);
    // //5580 - coorodor C5560
    // drawLine2(1143, 1463, 2885, 1453);
    // //closet 5404 via corridor C5400 via corridor C5405
    // drawLine2(3021, 1461, 2918, 1847);
    // //corridor C5405 
    // drawLine2(2918, 1847, 3430, 1984);
    // //corridor C5405 - C5100 via elevator 1-5PE7 corridor
    // drawLine2(3430, 1984, 4123, 2182);
    // //Junction of 5208,5108 corridor C5100
    // drawLine2(4123, 2182, 4272, 1624)
    // drawLine2(3084, 1232, 4274, 1618);
    // drawLine2(4428, 1093, 4274, 1618)
    // drawLine2(1142, 1200, 2888, 1199)
    // drawLine2(2888, 1199, 2886, 1461);
    // drawLine2(2886, 1461, 3023, 1461);
    // drawLine2(3084, 1232, 3023, 1461)