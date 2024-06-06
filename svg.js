const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
// document.body.addEventListener('click',(e)=>{
//     document.querySelector(".welcome").style.display = "none";
//     document.getElementById(
//         "inpt-group"
//     ).style.display = 'none'
// })

console.log(graphs);
const coordinatesElement = document.querySelector(".coordinates");
let start, end;
let graph;
let shortestRoute;
const allKeys = [];

output.forEach((office) => {
    Object.keys(office).forEach((k) => {
        document
            .querySelector(".offices")
            .insertAdjacentHTML("afterbegin", `<div class="number">${k}</div>`);
    })
})

document.querySelectorAll('.number').forEach(number => {
    number.addEventListener('click', () => {
        console.log('number clicked')
      // Copy the content of the clicked element to the clipboard
      const textToCopy = number.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change the background color of the element after it has been copied
        number.style.backgroundColor = 'yellow';
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  });
// console.log(output, graphs);
function getOffices(startPoint, endPoint) {
    let startAxis, endAxis;
    try {
        // Iterate over each office object
        output.forEach((office) => {
            const keys = Object.keys(office);
            
            // Extract office key and coordinates for start point
            if (office.hasOwnProperty(startPoint)) {
                // console.log("Office Startpoint Key:", startPoint);
                const { x, y } = office[startPoint].coordinates;
                startAxis = office[startPoint].axis;
                start = [x, y];
                // console.log("Coordinates:", start, startAxis);
            }
            // Extract office key and coordinates for end point
            if (office.hasOwnProperty(endPoint)) {
                // console.log("Office Endpoint Key:", endPoint);
                const { x, y } = office[endPoint].coordinates;
                endAxis = office[endPoint].axis;
                end = [x, y];
                // console.log("Coordinates:", end, endAxis);
            }
        });
        //Find the line that has the start and end offices mapped to it.
        //Use the values found to be the start and end line which will be used to get the appropiate route.
        if (startAxis && endAxis) {
            shortestRoute = findShortestRoute(graphs, startAxis, endAxis);
            pointToRoutes(shortestRoute);
            pointToPoint(svg, start, end);
        } else {
            pointToPoint(svg, start, end);
            coordinatesElement.classList.add("show");
            setTimeout(() => {
                coordinatesElement.classList.remove("show");
            }, 3000);
        }
        console.log("Coordinates:", graph, start, end, shortestRoute);
    } catch (error) {
        // console.log(error);
    }
}

function findRoute() {
    const startPoint = document.getElementById("from").value.trim();
    const endPoint = document.getElementById("to").value.trim();
    if (startPoint && endPoint) {
        getOffices(startPoint, endPoint);
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
function pointToRoutes(shortestRoute) {
    shortestRoute.forEach((segment) => {
        const [x1, y1, x2, y2] = segment;
        drawLine(x1, y1, x2, y2);
    });
}
// Set the SVG width and height attributes
const svg = document.querySelector("svg");
const image = document.querySelector("image");
image.setAttribute('width', '5400');
image.setAttribute('height', '7200')
window.addEventListener("DOMContentLoaded", (e) => {
    setTimeout(() => {
        document.querySelector(".welcome").style.display = "none";
    }, 2000);
    if (
        "ontouchstart" in window ||
        navigator.maxTouchPoints
    ) {
        svg.setAttribute("width", "5400");
        svg.setAttribute("height", "7200");
        image.setAttribute('width', '100%');
        image.setAttribute('height', '100%');

        // Optionally add preserveAspectRatio for the image
        //   image.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    } else {
        svg.setAttribute("width", `${window.innerWidth}px`);
        svg.setAttribute("height", "7200px");
    }

});

const lineColor = "blue"; // Default line color
const lineWidth = 15; // Adjust as needed
const drawingPath = [];
let startPoint = {};

function drawLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", lineColor);
    line.setAttribute("stroke-width", lineWidth);
    svg.appendChild(line);
    return line;
}

svg.addEventListener("mousedown", (e) => {
    startPoint = { x: e.clientX, y: e.clientY };
});

svg.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) {
        // Only draw when mouse button is pressed
        const line = drawLine(startPoint.x, startPoint.y, e.clientX, e.clientY);
        drawingPath.push(line);
        startPoint = { x: e.clientX, y: e.clientY };
    }
});

document.addEventListener("mouseup", () => {
    // No need to do anything here for SVG
});

document.getElementById("drawLine").addEventListener("click", () => {
    const lines = Array.from(svg.querySelectorAll('line')); // Convert NodeList to array
    lines.forEach(line => line.remove()); // Remove each line element
    // Clear icons and text
    const icons = svg.querySelectorAll('g');
    if (icons) {
        icons.forEach(icon => svg.removeChild(icon)); // Remove all icons
    }

    const texts = svg.querySelectorAll('text');
    if (texts) {
        texts.forEach(text => svg.removeChild(text)); // Remove all text elements
    }
    findRoute();
});



// Example usage
// clearDrawings(); // Call this function whenever you want to clear the SVG drawings

// Center the image inside the SVG
function centerImage() {
    image.setAttribute("x", (svg.clientWidth - image.clientWidth) / 2);
    image.setAttribute("y", (svg.clientHeight - image.clientHeight) / 2);
}
// centerImage(); // Call the function to center the image initially

// Function to draw the path on the SVG canvas
function drawPath() {
    drawingPath.forEach((line) => svg.appendChild(line));
}

// Function to convert points to routes
function pointsToRoute(shortestRoute) {
    shortestRoute.forEach((segment) => drawLine(...segment));
}

document.getElementById("inpt-group-btn").style.bottom = `1.5rem`;
// document.querySelector("canvas").style.display = "none";
document.querySelector(".welcome").style.display = "block";
const open_welcome = document.querySelector("#open-welcome");
const close_welcome = document.querySelector("#close-welcome");

open_welcome.addEventListener("click", (e) => {
    document.querySelector(".welcome").style.display = "block";
    document.querySelector(".logo").style.display = "none";
    document.querySelector(".loader-container").style.display = "none";
    document.querySelector(".welcome-text").innerHTML =
        "Offices Number";
});

//
close_welcome.addEventListener("click", (e) => {
    document.querySelector(".welcome").style.display = "none";
    console.log("closed clicked")
});

document.getElementById("inpt-group-btn").addEventListener("click", (e) => {
    document.getElementById("inpt-group").classList.toggle("none");
    document.getElementById(
        "inpt-group"
    ).style.transition = `transform 0.5s ease`;
    console.log('inpt btn clicked')
    if (document.getElementById("inpt-group").classList.contains("none")) {
        document.getElementById("inpt-group-btn").innerHTML =
            '<span class="material-symbols-outlined"> navigation </span>';
        document.getElementById("inpt-group-btn").style.bottom = `10rem`;
        document.getElementById("inpt-group-btn").style.zIndex = 5;
    } else {
        document.getElementById("inpt-group-btn").innerHTML =
            '<span class="material-symbols-outlined">\
        keyboard_hide\
        </span>';
        document.getElementById("inpt-group-btn").style.bottom = `15rem`;
    }
});

let zoomLevel = 1;
document.getElementById("zoom-in").addEventListener("pointerdown", zoomIn);
document.getElementById("zoom-out").addEventListener("pointerdown", zoomOut);

function zoomIn() {
    // Increase the zoom level
    zoomLevel += 0.25;
    document.getElementById("header").classList.add("none");
    // Apply the zoom level to the content
    document.querySelector("svg").classList.add("zoomed");
    document.querySelector("svg").style.transform = `scale(${zoomLevel})`;
    //   console.log("zoom in ", zoomLevel);
    //   updateHTMLPosition();//Stopped because the canvas translation is causing the page to zoom in too much
}

function zoomOut() {
    // Decrease the zoom level
    if (zoomLevel - 0.1 >= 1) {
        zoomLevel -= 0.25;
        // Apply the zoom to the svg
        document.querySelector("svg").classList.add("zoomed");
        document.querySelector("svg").style.transform = `scale(${zoomLevel})`;
        // console.log("zoom out ", zoomLevel);
        if (zoomLevel == 1) {
            setTimeout(() => {
                document.getElementById("header").classList.remove("none");
            }, 500);
        }
        // updateHTMLPosition()//Stopped because the canvas translation is causing the page to zoom out too much
    }
}
function updateHTMLPosition() {
    // Calculate canvas position
    const canvasRect = svg.getBoundingClientRect();
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
// Adjust viewport settings
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
                "width=device-width, initial-scale=1.0"
            );
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener("resize", adjustViewport);

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

// Function to draw location icon
function drawLocationIcon(svg, x, y) {
    const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 50);
    circle.setAttribute("fill", "orangered");

    const pin = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    pin.setAttribute("points", `${x},${y - 50} ${x - 10},${y - 40} ${x + 10},${y - 40}`);
    pin.setAttribute("fill", "blue");

    iconGroup.appendChild(circle);
    iconGroup.appendChild(pin);

    svg.appendChild(iconGroup);
}

// Function to draw text on icon
function drawTextOnIcon(svg, x, y, text) {
    const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.setAttribute("x", x);
    textElement.setAttribute("y", y + 70); // Adjust vertical position of text
    textElement.setAttribute("fill", "black");
    textElement.setAttribute("font-size", "24");
    textElement.setAttribute("text-anchor", "middle");
    textElement.textContent = text;

    svg.appendChild(textElement);
}

// Function to draw point to point
function pointToPoint(svg, start, end) {
    // Draw location icon at start point
    const [x1, y1] = start;
    drawLocationIcon(svg, x1, y1);
    drawTextOnIcon(svg, x1, y1, "Start"); // Display start text

    // Draw location icon at end point
    const [x2, y2] = end;
    drawLocationIcon(svg, x2, y2);
    drawTextOnIcon(svg, x2, y2, "End"); // Display end text
}
/*
for(initialization; condition; iteration) {
    statement
}
*/