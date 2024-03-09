
// const username = sessionStorage.getItem('username');
// console.log(username)

window.addEventListener('DOMContentLoaded',(e)=>{
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Request permission to display notifications
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                // Create a new notification
                var notification = new Notification("Hello, World!", {
                    body: "This is a notification message.",
                    icon: "path/to/icon.png" // Optional icon
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
})


document.getElementById('inpt-group-btn').style.bottom = `1.5rem`
document.querySelector('canvas').style.display = 'none';
document.querySelector('.welcome').style.display = 'block';
const open_welcome = document.querySelector('#open-welcome');
const close_welcome = document.querySelector('#close-welcome')


open_welcome.addEventListener('click',(e)=>{
    document.querySelector('.welcome').style.display = 'block';
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.loader-container').style.display = 'none';
    document.querySelector('.welcome-text').innerHTML = 'Instructions on how to use this software';
})

//
close_welcome.addEventListener('click',(e)=>{
    document.querySelector('.welcome').style.display = 'none';    
})


document.getElementById('inpt-group-btn').addEventListener('click',(e)=>{
    document.getElementById('inpt-group').classList.toggle('none')
    document.getElementById('inpt-group').style.transition = `transform 0.5s ease`;
    if(document.getElementById('inpt-group').classList.contains('none')){
        document.getElementById('inpt-group-btn').innerHTML = '<span class="material-symbols-outlined"> keyboard </span>'
        document.getElementById('inpt-group-btn').style.bottom = `1rem`
    }else{
        document.getElementById('inpt-group-btn').innerHTML = '<span class="material-symbols-outlined">\
        keyboard_hide\
        </span>';
        document.getElementById('inpt-group-btn').style.bottom = `12rem`
    }
})

let zoomLevel = 3;
document.getElementById('zoom-in').addEventListener('pointerdown', zoomIn);
document.getElementById('zoom-out').addEventListener('pointerdown', zoomOut);

function zoomIn() {
    // Increase the zoom level
    zoomLevel += 0.25;
    document.getElementById('header').classList.add('none');
    // Apply the zoom level to the content
    document.getElementById('myCanvas').classList.add('zoomed');
    document.getElementById('myCanvas').style.transform = `scale(${zoomLevel})`;
    console.log("zoom in ",zoomLevel)
    // updateHTMLPosition();Stopped because the canvas translation is causing the page to zoom in too much
}

function zoomOut() {
    // Decrease the zoom level
    if(zoomLevel - 0.1 >= 1) {
        zoomLevel -= 0.25;
        // Apply the zoom level to the myCanvas
        document.getElementById('myCanvas').classList.add('zoomed');
        document.getElementById('myCanvas').style.transform = `scale(${zoomLevel})`;
        console.log("zoom out ",zoomLevel)
        if(zoomLevel == 1){
            setTimeout(() => {
                document.getElementById('header').classList.remove('none')
            }, 500);
        }
        // updateHTMLPosition()Stopped because the canvas translation is causing the page to zoom out too much
    }
};


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "./SP1-2-floor-plan-5th-floor.jpg" || './SP1-2-floor-plan-5th-floor.jpg'; // Replace with your actual image URL

image.onload = function () {
    setTimeout(() => {
        document.querySelector('.welcome').style.display = 'none';        
    }, 2000);

    document.querySelector('canvas').style.display = 'block';
    if ('ontouchstart' in window || navigator.maxTouchPoints || /iPad|iPhone|iPod/.test(navigator.platform)) {
        document.querySelector('.devicename').innerHTML = navigator.platform
        // For touch devices, set a fixed size
        const aspectRatio = image.width / image.height;
        const maxWidth = 5400; // Adjust as needed
        const maxHeight = maxWidth / aspectRatio;
        
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        if(/iPad|iPhone|iPod/.test(navigator.platform)){
            canvas.width = document.body.getBoundingClientRect().width;
            canvas.height = document.body.getBoundingClientRect().height;
         document.querySelector('.devicename').innerHTML =
         `${navigator.platform}\s
         width ${canvas.width} height: ${canvas.height}\s 
         image height: ${image.height} image width: ${image.width}\s 
         device height: ${window.height || screen.height} width : ${window.width || screen.width}`;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        console.log(`2 image-width${image.width} : canvas-width ${canvas.width} image-height${image.height} : canvas.height ${canvas.height}, ${screen.width} ${screen.height}`);
        console.log(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height)
    } else {
        document.querySelector('.devicename').innerHTML = ` Your device is ${navigator.platform}`
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
};

image.loading = 'eager';
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

function drawLine2(x1, y1, x2, y2) {
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color
    ctx.shadowBlur = 5; // Shadow blur radius
    ctx.shadowOffsetX = 2; // Horizontal shadow offset
    ctx.shadowOffsetY = 2; // Vertical shadow offset
    
    ctx.fillStyle = 'orangered';
    ctx.fillRect(x1 - divWidth / 2, y1 - divHeight / 2, divWidth, divHeight);
    ctx.fillStyle = 'black';
    ctx.fillText(`${x1}-${y1}`, x1 - divWidth / 2 + 10, y1 + 5);

    // Reset shadow to default
    ctx.shadowColor = 'transparent';
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
    const htmlX = canvasX /* calculate X position based on zoom level */;
    const htmlY = canvasY /* calculate Y position based on zoom level */;
    const element = document.getElementById('myCanvas');
    element.style.left = htmlX + 'px';
    element.style.top = htmlY + 'px';
    // element.style.transform = `translate(${htmlX}px, ${htmlY}px)`;

}



canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    console.log(drawingPath,canvas,image); 
    });
// Get the select element
const selectElement = document.querySelector("select");

const goBtn = document.getElementById("drawLine");

goBtn.addEventListener("click", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the background image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Use a switch statement to handle different cases based on the selected value
    switch (selectElement.value) {
        case "point-to-point":
            pointToPoint();
            break;
        case "routes":
            console.log("routes");
            pointToRoutes();
            break;
        default:
            console.log("default");
            break;
    }
});

// 1971, y: 3454.199951171875,
function pointToPoint() {
    
    console.log("point to point");
    drawLine2(4274, 1618, 4123, 2182);
  }

function pointToRoutes(){
    // Now you have the shortest route and its length
    console.log("Shortest Route:", shortestRoute);
        // Iterate over each segment in the shortest route
    shortestRoute.forEach(segment => {
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
    console.log('from center Image'," ",canvas.width," ",image.width)
}

//Viewport fidelity
function adjustViewport() {
    const currentScale = window.visualViewport.scale;
    // Check if the scale is greater than 1 (zoomed in)
    if (currentScale > 1) {
        // Prevent the browser from scaling beyond the initial scale
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
        document.getElementById('header').classList.add('none');
    } else {
        // Revert to default viewport settings
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    }
}

// Event listener to detect changes in visual viewport scale (e.g., zooming)
window.visualViewport.addEventListener('resize', adjustViewport);

//sService worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  
// Define the graph as an array of line segments [x1, y1, x2, y2]
const graph = [
    [2448, 472, 2457, 715],
    [3678, 720, 2457, 715],
    [2454, 715, 1150, 720],
    [2448, 472, 3678, 474],
    [2448, 472, 1134, 474],
    [3230, 720, 3084, 1232],
    [3678, 474, 3678, 720],
    [3679, 879, 3678, 720],
    [679, 879, 3515, 818],
    [3515, 818, 3230, 720],
    [4163, 1016, 3679, 879],
    [4428, 1093, 4163, 1016],
    [4175, 1021, 4029, 1533],
    [3515, 818, 3366, 1318],
    [457, 1454, 2886, 1461],
    [4428, 1093, 4274, 1618],
    [3805, 1474, 3628, 2036],
    [3366, 1318, 4029, 1533],
    [4029, 1533, 4274, 1618],
    [3084, 1232, 3366, 1318],
    [1143, 1463, 2457, 1454],
    [4175, 1021, 4428, 1093],
    [2684, 4574.199951171875, 2822, 4126],
    [2822, 4126, 2684, 4574.199951171875],
    [2684, 4574.199951171875, 3132, 4704.800048828125],
    [3868.400001525879, 2113.2000122070312, 4029, 1533],
    [3132, 4704.800048828125, 2886, 5543.60009765625],
    [3545, 3259.199951171875, 3868.400001525879, 2113.2000122070312],
    [3270.400001525879, 4253.800048828125, 3132, 4704.800048828125],
    [3270.400001525879, 4253.800048828125, 3545, 3259.199951171875],
    [3392, 4788.60009765625, 3132, 4704.800048828125],
    [2457, 1454, 2451, 1191.2000122070312],
    [1881, 5527.800048828125, 2390, 5626.60009765625],
    [2451, 1191.2000122070312, 2457, 730.8000030517578],
    [3084, 1232, 3013.5999755859375, 1459.59997558593],
    [1143, 1463, 3018.5999755859375, 1455.79998779296],
    [2886, 1461, 3020.5999755859375, 1462.3999633789],
    [3013.5999755859375, 1459.59997558593, 2924, 1853.5999755859375],
    [3430, 1984, 3868.400001525879, 2113.2000122070312],
    [2924, 1853.5999755859375, 2665.5999755859375, 2746.59997558593],
    [2665.5999755859375, 2746.59997558593, 2567.5999755859375, 3020],
    [2567.5999755859375, 3020, 2442.199981689453, 3502.19995117187],
    [1144, 3495.199951171875, 2442.199981689453, 3502.19995117187],
    [2442.199981689453, 3502.19995117187, 2368.5999755859375, 3770.599853515625],
    [1142, 3763.39990234375, 2368.5999755859375, 3770.599853515625],
    [2822, 4126, 3270.400001525879, 4253.800048828125],
    [2368.5999755859375, 3770.599853515625, 2307, 3988],
    [3868.400001525879, 2113.2000122070312, 3545, 3259.199951171875],
    [3545, 3259.199951171875, 3270.400001525879, 4253.800048828125],
    [3270.400001525879, 4253.800048828125, 3532, 4318.199951171875],
    [1164, 3764.4000244140625, 2374, 3767.5999755859375],
    [1144.400001525879, 2755.800048828125, 1164, 3764.4000244140625],
    [2816, 4119.199951171875, 2684, 4574.199951171875],
    [2886, 1461, 3013.5999755859375, 1459.59997558593],
    [2684, 4574.199951171875, 3129, 4711.60009765625],
    [2390, 5626.60009765625, 2457, 5409.39990234375],
    [3270.400001525879, 4253.800048828125, 2828, 5742],
    [2828, 5742, 2604, 6564.60009765625],
    [2390, 5626.60009765625, 2828, 5742],
    [2092, 4733.60009765625, 2006, 5044.60009765625],
    [2006, 5044.60009765625, 1920, 5339.2001953125],
    [1920, 5339.2001953125, 1881, 5527.800048828125],
    [1881, 5527.800048828125, 1811, 5767.60009765625],
    [2390, 5626.60009765625, 1881, 5527.800048828125],
    [1744, 5985, 1811, 5767.60009765625],
    [1811, 5767.60009765625, 1376, 5770.60009765625],
    [1660, 6298.60009765625, 1744, 5985],
    [2390, 5626.60009765625, 2163, 6429.60009765625],
    [2163, 6429.60009765625, 1660, 6298.60009765625],
    [2163, 6429.60009765625, 2601, 6561.60009765625],
    [3270.400001525879, 4253.800048828125, 3532, 4321.199951171875],
    [3532, 4321.199951171875, 3392, 4788.60009765625],
    [3392, 4788.60009765625, 2684, 4574.199951171875],
    [3392, 4788.60009765625, 3542, 4855.60009765625],
    [3542, 4855.60009765625, 3318, 5649.60009765625],
    [2886, 5543.60009765625, 3318, 5649.60009765625],
    [3318, 5649.60009765625, 3034, 6679.60009765625],
    [2601, 6561.60009765625, 3034, 6679.60009765625],
    [3270.400001525879, 4253.800048828125, 2886, 5543.60009765625],
    [2684, 4574.199951171875, 2457, 5409.39990234375],
    [2886, 5543.60009765625, 2828, 5742],
    [2390, 5626.60009765625, 2163, 6439.60009765625],
    [1414, 5037.60009765625, 2009, 5041],
    [1382, 5325.800048828125, 1929, 5329.60009765625],
    [1417, 5975.60009765625, 1747, 5978.60009765625],
    [3017, 6676.800048828125, 3539, 4849],
    [2598, 5697.60009765625, 2838, 5757.60009765625],
    [3193, 3389.5999755859375, 3036, 3348.5999755859375],
    [2659, 5466.60009765625, 2896, 5556.60009765625],
    [2451, 1191.2000122070312, 2888, 1199],
    [2886, 1461, 2457, 1454],
    [3430, 1984, 2822, 4126],
    [2457, 1454, 2886, 1461],
    [2457, 1454, 2448, 472],
    [2448, 472, 2457, 1454],
    [2888, 1199, 2886, 1461],
    [1382, 5774, 1801, 5768],
    [2307, 3988, 2822, 4126],
    [3430, 1984, 2822, 4126],
    [3515, 818, 3678, 720],
    [4274, 1618, 4123, 2182],
    // Add other line segments similarly...
];

function arePointsEqual(point1, point2, tolerance = 0.001) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
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
            if (arePointsEqual(nextPoint1, currentPoint) && !visited.has(JSON.stringify(nextPoint2))) {
                const newRoute = [...route, segment];
                if (arePointsEqual(nextPoint2, end)) {
                    return newRoute; // Reached the end point
                }
                queue.push([nextPoint2, newRoute]);
                visited.add(JSON.stringify(nextPoint2));
            }
            if (arePointsEqual(nextPoint2, currentPoint) && !visited.has(JSON.stringify(nextPoint1))) {
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

// Example usage:
const start =[2888, 1199];
const end = [2390, 5626.60009765625];
const shortestRoute = findShortestRoute(graph, start, end);
console.log(shortestRoute);

try {
    console.log('from try')
} catch (error) {
    console.log(error)
}finally{
    console.log('code runs')
}