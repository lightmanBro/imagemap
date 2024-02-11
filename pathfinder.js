function findShortestPath(startRoom, endRoom) {
    // Perform Dijkstra's algorithm to find the shortest path
    // Initialize distances and previous nodes
    let distances = {}; // Distance from start to each node
    let previous = {}; // Previous node in the shortest path
    let visited = new Set(); // Set of visited nodes

    // Initialize distances and previous nodes
    // Initialize distances to infinity and previous nodes to null
    for (let room of rooms) {
        distances[room] = Infinity;
        previous[room] = null;
    }
    distances[startRoom] = 0; // Distance from start to start is 0

    while (visited.size < rooms.length) {
        let currentRoom = minDistanceNode(distances, visited);
        visited.add(currentRoom);

        // Update distances to neighbors of currentRoom
        for (let neighbor of getNeighbors(currentRoom)) {
            let distance = distances[currentRoom] + getDistance(currentRoom, neighbor);
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = currentRoom;
            }
        }
    }

    // Reconstruct the shortest path
    let shortestPath = [];
    let currentNode = endRoom;
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = previous[currentNode];
    }

    return shortestPath;
}

// Helper function to find the node with the minimum distance
function minDistanceNode(distances, visited) {
    let minDistance = Infinity;
    let minNode = null;
    for (let room in distances) {
        if (!visited.has(room) && distances[room] <= minDistance) {
            minDistance = distances[room];
            minNode = room;
        }
    }
    return minNode;
}

// Helper function to get neighbors of a node (rooms connected by paths)
function getNeighbors(room) {
    return paths.filter(path => path.startRoom === room).map(path => path.endRoom);
}

// Helper function to get the distance between two rooms (length of path)
function getDistance(room1, room2) {
    let path = paths.find(path => path.startRoom === room1 && path.endRoom === room2);
    return path ? path.length : Infinity; // Return length of path if found, Infinity otherwise
}

// Sample data
let rooms = [1, 2, 3, 4, 5];
let paths = [
    { startRoom: 1, endRoom: 2, length: 10 },
    { startRoom: 2, endRoom: 3, length: 15 },
    { startRoom: 3, endRoom: 4, length: 20 },
    { startRoom: 4, endRoom: 5, length: 25 }
];

// Find the shortest path from Room 1 to Room 5
let shortestPath = findShortestPath(2, 1);
console.log("Shortest path:", shortestPath);

// Define the graph as an adjacency list
const graph = {};

// Populate each array with numbers from 1 to 100
for (let i = 1; i <= 6; i++) {
    graph[i] = Array.from({ length: 100 }, (_, index) => index + 1);
}

// Connect each array to the next one
for (let i = 1; i <= 5; i++) {
    graph[i].push(i + 1);
}

// Function to perform depth-first search traversal of the graph
function dfs(node, visited) {
    if (!visited.has(node)) {
        console.log("Visiting Array", node);
        visited.add(node);
        for (let neighbor of graph[node]) {
            if (neighbor <= 100) { // Ensure we don't go beyond the range of numbers
                dfs(neighbor, visited);
            }
        }
    }
}

// Start DFS traversal from Array 1
const visited = new Set();
dfs(1, visited);
