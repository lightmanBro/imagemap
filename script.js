document.getElementById("inpt-group-btn").addEventListener("click", (e) => {
    document.getElementById("inpt-group").classList.toggle("none");
    document.getElementById(
        "inpt-group"
    ).style.transition = `transform 0.5s ease`;
    if (document.getElementById("inpt-group").classList.contains("none")) {
        document.getElementById("inpt-group-btn").innerHTML =
            '<span class="material-symbols-outlined"> keyboard </span>';
        document.getElementById("inpt-group-btn").style.bottom = `1rem`;
    } else {
        document.getElementById("inpt-group-btn").innerHTML =
            '<span class="material-symbols-outlined">\
        keyboard_hide\
        </span>';
        document.getElementById("inpt-group-btn").style.bottom = `12rem`;
    }
});

let zoomLevel = 3;
window.addEventListener("load", (e) => {
    // document.getElementById('myCanvas').style.transform = `scale(${zoomLevel/2})`;
});
document.getElementById("zoom-in").addEventListener("pointerdown", zoomIn);
document.getElementById("zoom-out").addEventListener("pointerdown", zoomOut);
if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
            if (permissionState === "granted") {
                window.addEventListener("devicemotion", (e) => {
                    console.log("AccelarationX ", e.acceleration.x);
                    console.log("AccelarationY ", e.acceleration.y);
                    console.log("AccelarationZ ", e.acceleration.z);
                });
            } else {
                console.error("motion sensor access denied");
            }
        })
        .catch(console.error);
} else {
    console.error("Motion sensor not supported on this device");
}

function zoomIn() {
    // Increase the zoom level
    zoomLevel += 0.25;
    document.getElementById("header").classList.add("none");
    // Apply the zoom level to the content
    document.getElementById("myCanvas").classList.add("zoomed");
    document.getElementById("myCanvas").style.transform = `scale(${zoomLevel})`;
    console.log("zoom in ", zoomLevel);
}

function zoomOut() {
    // Decrease the zoom level
    if (zoomLevel - 0.1 >= 1) {
        zoomLevel -= 0.25;
        // Apply the zoom level to the myCanvas
        document.getElementById("myCanvas").classList.add("zoomed");
        document.getElementById("myCanvas").style.transform = `scale(${zoomLevel})`;
        console.log("zoom out ", zoomLevel);
        if (zoomLevel == 1) {
            setTimeout(() => {
                document.getElementById("header").classList.remove("none");
            }, 500);
        }
    }
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "SP1-2-floor-plan-5th-floor.jpg"; // Replace with your actual image URL

image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    centerImage();
};

let isDrawing = false;
let drawingPath = [];
let lastX = 0;
let lastY = 0;
let lineColor = "blue"; // Default line color
ctx.strokeStyle = lineColor; // Set default line color
ctx.lineJoin = "round";
// Set line width
const lineWidth = 15; // Adjust as needed

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    drawingPath = [{ x: e.offsetX, y: e.offsetY }];
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        drawingPath.push({ x: currentX, y: currentY });
        drawLine(lastX, lastY, currentX, currentY);
        lastX = currentX;
        lastY = currentY;
    }
});

// Define the drawLine function to draw a line between two points with animation
function drawLine(x1, y1, x2, y2) {
    let start = null;
    const duration = 2000; // Duration of the animation in milliseconds
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        // Calculate the current position of the line
        const currentX = x1 + (x2 - x1) * (progress / duration);
        const currentY = y1 + (y2 - y1) * (progress / duration);
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw the image or any other content if needed
        ctx.drawImage(image, 0, 0);
        // Draw the line up to the current position
        drawLine2(x1, y1, currentX, currentY);

        // Continue the animation until the duration is reached
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    // Start the animation
    requestAnimationFrame(animate);
}
/*Shortest path algorithm */
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
    "1228,530": { "4165,530": 1 },
    "4165,530": { "1228,530": 1, "4165,811": 1 },
    "4165,811": { "4165,530": 1, "1384,811": 1 },
    "1384,811": { "4165,811": 1, "3646,811": 1 },
    "3646,811": { "1384,811": 1, "3496,1384": 1 },
    "3496,1384": { "3646,811": 1, "3496,2069": 1 },
    "3496,2069": { "3496,1384": 1 },
};

const start = "1228,530";
const end = "3496,2069";

const shortestPath = dijkstra(graph, start, end);

console.log("Shortest path:", shortestPath);

function convertToCoordinates(shortestPath) {
    const coordinates = [];
    for (let i = 0; i < shortestPath.length - 1; i++) {
        const [x1, y1] = shortestPath[i].split(",").map(Number);
        const [x2, y2] = shortestPath[i + 1].split(",").map(Number);
        coordinates.push({ x1, y1, x2, y2 });
    }
    return coordinates;
}

function drawLine2(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth; // Set line width
    ctx.stroke();
}

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    console.log(drawingPath);
    // Example usage
    // const shortestPath = ['1228,530', '4165,530', '4165,811', '1384,811', '3646,811', '3496,1384', '3496,2069'];
    const coordinates = convertToCoordinates(shortestPath);
    console.log("Path coordinates:", coordinates);

    for (let i = 0; i < coordinates.length; i++) {
        setTimeout(() => {
            const coord = coordinates[i];
            drawLine2(coord.x1, coord.y1, coord.x2, coord.y2);
        }, i * 1000); // Delay in milliseconds, e.g., 1000ms = 1 second
    }
});

// Function to draw the path on the canvas
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    ctx.beginPath();
    ctx.moveTo(drawingPath[0].x, drawingPath[0].y); // Start from the first recorded position
    for (let i = 1; i < drawingPath.length; i++) {
        ctx.lineTo(drawingPath[i].x, drawingPath[i].y); // Draw line to each subsequent point
    }
    ctx.stroke();
}

const drawLineButton = document.getElementById("drawLine");
drawLineButton.addEventListener("click", () => {
    // Do something when the button is clicked
    console.log("Draw line button clicked");
});

function drawCoordinate(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

// Center the image inside the canvas
function centerImage() {
    const x = (canvas.width - image.width) / 2;
    const y = (canvas.height - image.height) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y);
}
//Viewport fidelity

function adjustViewport() {
    const currentScale = window.visualViewport.scale;
    // Check if the scale is greater than 1 (zoomed in)
    if (currentScale > 1) {
        // Prevent the browser from scaling beyond the initial scale
        document
            .querySelector('meta[name="viewport"]')
            .setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, maximum-scale=1.0"
            );
        document.getElementById("header").classList.add("none");
    } else {
        // Revert to default viewport settings
        document
            .querySelector('meta[name="viewport"]')
            .setAttribute(
                "content",
                "width=device-width, initial-scale=1.0, user-scalable=no"
            );
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener("resize", adjustViewport);

// Add event listener for devicemotion
if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
            if (permissionState === "granted") {
                window.addEventListener("devicemotion", handleMotionEvent);
                window.alert("motion activated");
            } else {
                window.alert("Motion sensor access denied");
            }
        })
        .catch(console.error);
} else {
    console.error("Motion sensor not supported on this device");
}

// Function to handle motion events
function handleMotionEvent(event) {
    // Update position based on device acceleration
    x += event.accelerationIncludingGravity.x;
    y += event.accelerationIncludingGravity.y;
    window.alert(
        event.accelerationIncludingGravity.x,
        " : ",
        event.accelerationIncludingGravity.y
    );
    // Draw the updated position on the canvas
    drawPosition();
}

// Function to draw the user's current position on the canvas
function drawPosition() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    ctx.drawImage(image, 0, 0);

    // Draw a circle at the current position
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}
