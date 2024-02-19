if ('ontouchstart' in window || navigator.maxTouchPoints || /iPad|iPhone|iPod/.test(navigator.platform)) {
    // Touch events are supported
    screen.width;
    console.log(navigator.platform)
} else {
    // Touch events are not supported
    window.innerWidth;
}





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
canvas.width =5400;
canvas.height = 7200
image.width =canvas.width;
image.height = canvas.height;
console.log(image);
image.src = "./SP1-2-floor-plan-5th-floor.jpg"; // Replace with your actual image URL

// Disable image smoothing to prevent blurriness
// ctx.imageSmoothingEnabled = true;

image.onload = function () {
    setTimeout(() => {
        document.querySelector('.welcome').style.display = 'none';        
    }, 2000);

    document.querySelector('canvas').style.display = 'block';
    //Had to shut this down because its cutting the canvas to half.
    // image.width = '100%';
    // canvas.height = window.clientY;
    if ('ontouchstart' in window || navigator.maxTouchPoints || /iPad|iPhone|iPod/.test(navigator.platform)) {
        console.log(navigator.platform,canvas.width)
        canvas.width =5400;
        canvas.height = 7200
        canvas.style.border = '2px solid purple'
        document.querySelector('.dimension').innerHTML = `2 image-width${image.width} : canvas-width ${canvas.width} image-height${image.height} : canvas.height ${canvas.height} : ${screen.width} ${screen.height} border color`
        console.log(`2 image-width${image.width} : canvas-width ${canvas.width} image-height${image.height} : canvas.height ${canvas.height}, ${screen.width} ${screen.height}`);
        console.log(canvas)
    } else {
        // Touch events are not supported
        canvas.width = window.innerWidth;
        console.log(navigator.platform,canvas.width)
        canvas.width = image.width;
        canvas.height = image.height;
        console.log(`1 image-width${image.width} : canvas-width ${canvas.width} image-height${image.height} : canvas.height ${canvas.height}`)
    }
    centerImage();
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
        // Calculate the mouse position relative to the document
        const currentX = e.clientX + window.scrollX;
        const currentY = e.clientY + window.scrollY;
        drawingPath.push({ x: currentX, y: currentY });
        drawLine(lastX, lastY, currentX, currentY);
        lastX = currentX;
        lastY = currentY;
    }
});

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth; // Set line width
    ctx.stroke();
    ctx.save()
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
    ctx.fillText('office 204', x1 - divWidth / 2 + 10, y1 + 5);

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
    
    /*
    To implement the direction on the map we need to use
     (beginning)-> Where the user wants to move from.
      (via)-> [arrays of coordinates that the route is on]
     (End)-> The final destination of the user, either the name of the office or the number of the office.
    */
    //5520 - 5500
    drawLine2(1134, 474, 3678, 474);
    //Wrkst 5544-5545
    drawLine2(3678, 464, 3678, 720)
    //5525- wrkst 5545
    drawLine2(3678, 720, 1150, 720);
    //5541 - corridor C5001
    drawLine2(3200, 720, 4428, 1093)
    //5541 - corridor C5000
    drawLine2(3220, 720, 3084, 1232)
    //corridor C5002
    drawLine2(3515, 818, 3366, 1318)
    drawLine2(4175, 1021, 4029, 1533);
    //corridor C5000-C5110 to the back of 5208 and elevator 1-5PE7
    drawLine2(4029, 1533, 3862, 2099);
    //C5000 via Elevator lobby Elevator 4 - 11
    drawLine2(3805, 1474, 3628, 2036);
    //5580 - coorodor C5560
    drawLine2(1143, 1463, 2885, 1453);
    //closet 5404 via corridor C5400 via corridor C5405
    drawLine2(3021, 1461, 2918, 1847);
    //corridor C5405 
    drawLine2(2918, 1847, 3430, 1984);
    //corridor C5405 - C5100 via elevator 1-5PE7 corridor
    drawLine2(3430, 1984, 4123, 2182);
    //Junction of 5208,5108 corridor C5100
    drawLine2(4123, 2182, 4272, 1624)
    //C5000 corridor
    drawLine2(3084, 1232, 4274, 1618);
    //5201 supply - 5203 corridor
    drawLine2(4428, 1093, 4274, 1618)
    //5554 pantry to 5560 corridor
    drawLine2(1142, 1200, 2888, 1199)
    //C5560 corridor
    drawLine2(2888, 1199, 2886, 1461);
    //C5560 corridor join comm rm, closet
    // drawLine2(4272, 1624, 3023, 1461);
    //5404 closet corridor
    //5209 - 5524 corridor 5405 5510
    drawLine2(4121.60000038147,2171.800003051758,3532,4321.199951171875);
    //5407-5424 corridor 5405 5510
    drawLine2(3414.400001525879,1991.5999755859375,2822,4126);
    //5307 - corridor 5405 5510
    drawLine2(2924,1853.5999755859375,2313,3988.5999755859375)
    //pantry 5020 - coom rm 15 CR-D corridor 5405 5510
    drawLine2(3868.400001525879, 2113.2000122070312,3270.400001525879,4253.800048828125);
    //Copy and print 5514 - 5612/5613 corridor C5610
    drawLine2(1144.400001525879,2755.800048828125,2671.400001525879,2752.800048828125);
    //Supply 5617-5626 corridor C5620
    drawLine2(1151,3035.5999755859375,2595,3037.5999755859375);
    //Corridor C5635
    drawLine2(1154.400001525879,3492,2463.400001525879,3496);
    //
    drawLine2(1164,3764.4000244140625,2374,3767.5999755859375);

    //
    // drawLine2(1144.400001525879,2755.800048828125,1164,3764.4000244140625)
    //Corridor C5325,C5225,C5020
    drawLine2(2323,3988,3536, 4321.5999755859375);
    //
    drawLine2(3097,3143.800048828125,3795,3348.800048828125);
    //
    drawLine2(2816,4119.199951171875,2163,6439.60009765625);
    //
    drawLine2(3267,4247.199951171875,2614,6561.199951171875);
    //
    drawLine2(2102,4743.60009765625,1654,6308.60009765625);
    //
    drawLine2(1414,5037.60009765625,2009,5041,);
    //
    drawLine2(1382,5325.800048828125,1929,5329.60009765625);
    //
    drawLine2(1382,5774,1801,5768);
    //
    drawLine2(1417,5975.60009765625,1747,5978.60009765625);
    //
    drawLine2(3392,4791.199951171875,3529,4318.199951171875);
    //
    drawLine2(2681,4596.60009765625,3539,4849);
    //
    drawLine2(3017,6676.800048828125,3539,4849);
    //
    drawLine2(1651,6298.800048828125,3017,6676.800048828125);
    // Elevator lobby 2-5PE-3
    drawLine2(2598,5697.60009765625,2838,5757.60009765625);
    // Elevator lobby 2-5PE-2
    drawLine2(3193,3389.5999755859375,3036,3348.5999755859375);
    //Toilet Corridor 2 C5265
    drawLine2(2659,5466.60009765625,2896,5556.60009765625);

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


// Center the image inside the canvas
function centerImage() {
    const x = (canvas.width - image.width) / 2;
    const y = (canvas.height - image.height) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y);
    console.log('from center Image',x," ",y," ",canvas.width," ",image.width)
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