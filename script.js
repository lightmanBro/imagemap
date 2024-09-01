const coordinatesElement = document.querySelector(".coordinates");
let start, end;
let graph;
let shortestRoute;
const allKeys = [];

function getOffices(startPoint, endPoint) {
  let startAxis, endAxis;
  try {
   
      // Iterate over each office object
      output.forEach((office) => {
        const keys = Object.keys(office);
        allKeys.push(...keys);
        // Extract office key and coordinates for start point
        if (office.hasOwnProperty(startPoint)) {
          console.log("Office Startpoint Key:", startPoint);
          const { x, y } = office[startPoint].coordinates;
          startAxis = office[startPoint].axis;
          start = [x, y];
          console.log("Coordinates:", start, startAxis);
        }
        // Extract office key and coordinates for end point
        if (office.hasOwnProperty(endPoint)) {
          console.log("Office Endpoint Key:", endPoint);
          const { x, y } = office[endPoint].coordinates;
          endAxis = office[endPoint].axis;
          end = [x, y];
          console.log("Coordinates:", end, endAxis);
        }
      });
      //Find the line that has the start and end offices mapped to it.
      //Use the values found to be the start and end line which will be used to get the appropiate route.
      if (startAxis && endAxis) {
        shortestRoute = findShortestRoute(graphs, startAxis, endAxis);
        pointToRoutes(shortestRoute);
        pointToPoint(start, end);
      } else {
        pointToPoint(start, end);
        coordinatesElement.classList.add("show");
        setTimeout(() => {
          coordinatesElement.classList.remove("show");
        }, 3000);
      }
      // console.log("Coordinates:",graph,start,end,shortestRoute);
   
  } catch (error) {
    console.log(error);
  }
}

function findRoute() {
  const startPoint = document.getElementById("from").value.trim();
  const endPoint = document.getElementById("to").value.trim();
  if (startPoint && endPoint) {
    getOffices(startPoint, endPoint);
    allKeys.forEach((k) => {
      document
        .querySelector(".offices")
        .insertAdjacentHTML("afterbegin", `<div class="number">${k}</div>`);
    });

    // Add event listeners to the newly created .number elements
    
  } else {
    drawLine2(startPoint || endPoint);
    coordinatesElement.classList.add("show");
    coordinatesElement.innerHTML =
      "Please provide both start point and destination.";
    setTimeout(() => {
      coordinatesElement.classList.remove("show");
    }, 3000);
  }
}

// import { coordinates } from "../output.js";
// console.log(coordinates);
window.addEventListener("DOMContentLoaded", (e) => {
  // Check if the browser supports the Notification API
  if ("Notification" in window) {
    // Request permission to display notifications
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        // Create a new notification
        var notification = new Notification("Hello, World!", {
          body: "This is a notification message.",
          icon: "/icon.png", // Optional icon
        });

        // Handle click events on the notification
        notification.onclick = function () {
          console.log("Notification clicked");
          // Add your custom click event handler here
        };

        // Automatically close the notification after a specified duration (in milliseconds)
        setTimeout(function () {
          notification.close();
        }, 5000); // Close after 5 seconds (adjust as needed)
      } else if (permission === "denied") {
        console.log("Notification permission denied");
        // You can inform the user that notifications are blocked
      } else {
        console.log("Notification permission has not been granted yet");
        // You can inform the user to grant permission for notifications
      }
    });
  } else {
    console.log("Browser does not support notifications");
    // Inform the user that their browser does not support notifications
  }
});

document.getElementById("inpt-group-btn").style.bottom = `1.5rem`;
document.querySelector("canvas").style.display = "none";
document.querySelector(".welcome").style.display = "block";
const open_welcome = document.querySelector("#open-welcome");
const close_welcome = document.querySelector("#close-welcome");

open_welcome.addEventListener("click", (e) => {
  document.querySelector(".welcome").style.display = "block";
  document.querySelector(".logo").style.display = "none";
  document.querySelector(".loader-container").style.display = "none";
  document.querySelector(".welcome-text").innerHTML =
    "Office Number Lists";
});

//
close_welcome.addEventListener("click", (e) => {
  document.querySelector(".welcome").style.display = "none";
});

document.getElementById("inpt-group-btn").addEventListener("click", (e) => {
  document.getElementById("inpt-group").classList.toggle("none");
  document.getElementById(
    "inpt-group"
  ).style.transition = `transform 0.5s ease`;
  if (document.getElementById("inpt-group").classList.contains("none")) {
    document.getElementById("inpt-group-btn").innerHTML =
      '<span class="material-symbols-outlined"> navigation </span>';
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
document.getElementById("zoom-in").addEventListener("pointerdown", zoomIn);
document.getElementById("zoom-out").addEventListener("pointerdown", zoomOut);

function zoomIn() {
  // Increase the zoom level
  zoomLevel += 0.25;
  document.getElementById("header").classList.add("none");
  // Apply the zoom level to the content
  document.getElementById("myCanvas").classList.add("zoomed");
  document.getElementById("myCanvas").style.transform = `scale(${zoomLevel})`;
  console.log("zoom in ", zoomLevel);
  // updateHTMLPosition();Stopped because the canvas translation is causing the page to zoom in too much
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
    // updateHTMLPosition()Stopped because the canvas translation is causing the page to zoom out too much
  }
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const image = new Image();
image.src =
  "./SP1-2-floor-plan-5th-floor.jpg" || "./SP1-2-floor-plan-5th-floor.jpg"; // Replace with your actual image URL
  image.onload = function () {
    setTimeout(() => {
        document.querySelector(".welcome").style.display = "none";
    }, 2000);

    document.querySelector("canvas").style.display = "block";
    if (
        "ontouchstart" in window ||
        navigator.maxTouchPoints ||
        /iPad|iPhone|iPod/.test(navigator.platform)
    ) {
        document.querySelector(".devicename").innerHTML = navigator.platform;
        // For touch devices, set a fixed size
        const aspectRatio = image.width / image.height;
        const maxWidth = 5400; // Maximum width (adjust as needed)
        const maxHeight = maxWidth / aspectRatio;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        if (/iPad|iPhone|iPod|MacIntel/.test(navigator.platform)) {
            // For iOS devices, calculate canvas size based on screen dimensions
            const screenWidth = window.innerWidth || screen.width;
            const screenHeight = window.innerHeight || screen.height;
            const maxSize = Math.min(screenWidth, screenHeight) * 0.9; // Adjust to fit within 90% of screen size

            canvas.width = maxSize;
            canvas.height = maxSize / aspectRatio;

            document.querySelector(".devicename").innerHTML = `${navigator.platform} width: ${canvas.width}, height: ${canvas.height}`;
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        console.log(
            `Image - width: ${image.width}, height: ${image.height} | Canvas - width: ${canvas.width}, height: ${canvas.height}`
        );
    } else {
        // For non-touch devices, use image dimensions
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
};


image.loading = "eager";
let isDrawing = false;
let drawingPath = [];
let lastX = 0;
let lastY = 0;
let lineColor = "blue"; // Default line color
ctx.strokeStyle = lineColor; // Set default line color
ctx.lineJoin = "round";
// Set line width
const lineWidth = 15; // Adjust as needed

canvas.addEventListener("touchmove", (e) => {
    if (isDrawing) {
      e.preventDefault(); // Prevent default touch behavior
      const touch = e.touches[0];
      const currentX = touch.clientX + window.scrollX;
      const currentY = touch.clientY + window.scrollY;
      drawingPath.push({ x: currentX, y: currentY });
      drawLine(lastX, lastY, currentX, currentY);
      lastX = currentX;
      lastY = currentY;
    }
  });
  
canvas.addEventListener("touchend", () => {
isDrawing = false;
});

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  // Calculate the mouse position relative to the document
  lastX = e.clientX + window.scrollX;
  lastY = e.clientY + window.scrollY;
  drawingPath = [{ x: lastX, y: lastY }];
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    const currentX = e.clientX + window.scrollX;
    const currentY = e.clientY + window.scrollY;
    drawingPath.push({ x: currentX, y: currentY });
    drawLine(lastX, lastY, currentX, currentY);
    lastX = currentX;
    lastY = currentY;
  }
});

// Optimize canvas drawing functions for performance
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineWidth; // Set line width
  ctx.stroke();
}

let allCoordinates = [];

// Function to add coordinates to the array
function addCoordinates(x1, y1, x2, y2) {
  allCoordinates.push([x1, y1, x2, y2]);
  // console.log(allCoordinates);
}
const newGraph = [];
function drawLine2(x1, y1, x2, y2) {
  addCoordinates(x1, y1, x2, y2);
  newGraph.push([x1,y1,x2,y2]);
  // Draw the line on the canvas
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineWidth; // Set line width
  ctx.stroke();

  // Draw the rectangle representing the div
  const divWidth = 100;
  const divHeight = 100;

  // Add shadow to the div
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color
  ctx.shadowBlur = 5; // Shadow blur radius
  ctx.shadowOffsetX = 2; // Horizontal shadow offset
  ctx.shadowOffsetY = 2; // Vertical shadow offset

  ctx.fillStyle = "orangered";
  ctx.fillRect(x1 - divWidth / 2, y1 - divHeight / 2, divWidth, divHeight);
  ctx.fillStyle = "black";
  ctx.fillText(`${x1}-${y1}`, x1 - divWidth / 2 + 10, y1 + 5);

  // Reset shadow to default
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// Function to update HTML content position
function updateHTMLPosition() {
  // Calculate canvas position
  const canvasRect = canvas.getBoundingClientRect();
  const canvasX = canvasRect.left;
  const canvasY = canvasRect.top;

  // Calculate HTML content position relative to canvas
  const htmlX = canvasX; /* calculate X position based on zoom level */
  const htmlY = canvasY; /* calculate Y position based on zoom level */
  const element = document.getElementById("myCanvas");
  element.style.left = htmlX + "px";
  element.style.top = htmlY + "px";
  // element.style.transform = `translate(${htmlX}px, ${htmlY}px)`;
}
const paths = []
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  console.log(drawingPath);
  paths.push(drawingPath);
});

const goBtn = document.getElementById("drawLine");

// goBtn.addEventListener("click", (e) => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // Redraw the background image
//   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
// })
console.log(newGraph);
// 1971, y: 3454.199951171875,
function pointToPoint(start, end) {
  console.log("point to point");

  // Draw location icon at start point
  const [x1, y1] = start;
  drawLocationIcon(x1, y1);
  drawTextOnIcon(x1, y1, "Start"); // Display start text

  // Draw location icon at end point
  const [x2, y2] = end;
  drawLocationIcon(x2, y2);
  drawTextOnIcon(x2, y2, "End"); // Display end text
}

function drawLocationIcon(x, y) {
  const radius = 50; // Half of the desired width and height (100x100)

  // Draw the circle representing the location icon
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "orangered"; // You can set the color of the location icon here
  ctx.fill();

  // Draw the "pin" part of the location icon
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x - 10, y + 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.closePath();
  ctx.fillStyle = "blue"; // You can set the color of the "pin" part here
  ctx.fill();
}

function drawTextOnIcon(x, y, text) {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial"; // Increase font size
  ctx.textAlign = "center";
  ctx.fillText(text, x, y - 70); // Adjust the position of the text as needed
}

//NOTE2-5pe-3,1-5PE-2 5712,2C-5265 is not mapped
function pointToRoutes(shortestRoute) {
  // Now you have the shortest route and its length
  console.log("Shortest Route:", shortestRoute);
  // Iterate over each segment in the shortest route
  shortestRoute.forEach((segment) => {
    const [x1, y1, x2, y2] = segment;
    // Call draw2() with the coordinates of the current segment
    drawLine2(x1, y1, x2, y2);
  });
}
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

// Center the image inside the canvas
function centerImage() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  console.log("from center Image", " ", canvas.width, " ", image.width);
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

//sService worker

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Define the graph as an array of line segments [x1, y1, x2, y2]
function arePointsEqual(point1, point2, tolerance = 0.001) {
  let [x1, y1] = Array.isArray(point1) ? point1 : [point1.x, point1.y];
  let [x2, y2] = Array.isArray(point2) ? point2 : [point2.x, point2.y];

  return Math.abs(x1 - x2) < tolerance && Math.abs(y1 - y2) < tolerance;
}

function findShortestRoute(graph, start, end) {
  const visited = new Set();
  const queue = [[start, []]]; // Queue of [currentPoint, route]

  while (queue.length > 0) {
    const [currentPoint, route] = queue.shift();
    visited.add(JSON.stringify(currentPoint));

    for (const segment of graph) {
      const [x1, y1, x2, y2] = segment;
      const nextPoint1 = [x1, y1];
      const nextPoint2 = [x2, y2];
      if (
        arePointsEqual(nextPoint1, currentPoint) &&
        !visited.has(JSON.stringify(nextPoint2))
      ) {
        const newRoute = [...route, segment];
        if (arePointsEqual(nextPoint2, end)) {
          return newRoute; // Reached the end point
        }
        queue.push([nextPoint2, newRoute]);
        visited.add(JSON.stringify(nextPoint2));
      }
      if (
        arePointsEqual(nextPoint2, currentPoint) &&
        !visited.has(JSON.stringify(nextPoint1))
      ) {
        const newRoute = [...route, segment];
        if (arePointsEqual(nextPoint1, end)) {
          return newRoute; // Reached the end point
        }
        queue.push([nextPoint1, newRoute]);
        visited.add(JSON.stringify(nextPoint1));
      }
    }
  }

  return []; // No path found to end point
}
