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
    "Instructions on how to use this software";
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

goBtn.addEventListener("click", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the background image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  // Use a switch statement to handle different cases based on the selected value
      // findRoute(); 
  console.log(paths);
  //5500
  drawLine2(3584,459, 3676,452) 
  //5501 5544
  drawLine2(3676,452,3513,459)
  //5502 5543
  drawLine2(3513,459,3395,452)
  //5503 5542
  drawLine2(3395,452,3292,465)
  //5504 5541
  drawLine2(3292,465, 3187,456)
  //5505 5540
  drawLine2(3187,456, 3123,456)
  //5506 5539
  drawLine2(3123,456,2931,452)
  //5507 5538
  drawLine2(2931,452,2873,446)
  //5508
  drawLine2(2873,446,2697,452)
  //5509
  drawLine2(2697,452,2627,456)
  //1C5510 corridor
  drawLine2(2627,456,2460,452);
  //5510 5535
  drawLine2(2460,452,2377,443);
  //5512
  drawLine2(2377,443,2195,452)
  //5513
  drawLine2(2195,452,2146,450);
  //5514
  drawLine2(1952,453,2146,450);
  //5515
  drawLine2(1891,444,1952,453);
  //5516 5517 5528 5529
  drawLine2(1683,462,1891,444)
  //5518 5519 5527 5526
  drawLine2(1437, 459,1683,462);
  //5525
  drawLine2(1254,461,1437, 459);
  //5520
  drawLine2(1190,454,1254,461);
  //5521
  drawLine2(1161,451,1190,454);
  //5522 5523
  drawLine2(1143,598,1161,451)
  //empty junction
  drawLine2(1145,731,1143,598);
  //5525-2
  drawLine2(1248,723,1145,731);
  //5553 5554
  drawLine2(1148,991,1145,731);
  //1-5CR-A
  drawLine2(1365,734,1248,723)
  //1-5M-SE
  drawLine2(1478,742,1365,734)
  //1-5FR-A
  drawLine2(1742,743,1478,742);
  //5550 5551
  drawLine2(2291, 734,1742,743)
  //5534 
  drawLine2(2374,720,2291, 734);
  //5535 corridor
  drawLine2( 2457,728.4000015258789,2460,452);
  //5550 corridor
  drawLine2(2459,1196,2457,728.4000015258789);
  //5580 corridor
  drawLine2(2463,1470,2459,1196)
  //5549
  drawLine2(2582,724,2457,728.4000015258789);
  //5547 5548
  drawLine2(2732,733.5999984741211,2582,724);
  //5546
  drawLine2(2944,732,2732,733.5999984741211);
  //
  drawLine2(3212,734,2944,732);
  //
  drawLine2(3520,763,3212,734);
  //
  drawLine2( 3680,744,3520,763);
  // join with 5501
  drawLine2(3680,744,3678,452);
  //5001 5002
  drawLine2(3446,1025,3520,763)
  //5003 5004
  drawLine2(3161,948,3212,734);
  //
  drawLine2(3091,1194.6000061035156,3161,948);
  //
  drawLine2(3376,1291.2000122070312,3091,1194.6000061035156);
  //
  drawLine2(3446,1025,3376,1291.2000122070312);
  //
  drawLine2(3592,1375,3376,1291.2000122070312);
  //5304 5205
  drawLine2(3529,1572.6000061035156,3592,1375)
  //5306
  drawLine2(3475,1788.2000122070312,3529,1572.6000061035156);
  //
  drawLine2(3420,1968.7999877929688,3475,1788.2000122070312);
  //1-5ST-D
  drawLine2(3488,1995,3420,1968.7999877929688);
  //5307
  drawLine2(3309,1942.800048828125,3420,1968.7999877929688);
  //5407
  drawLine2(3155,1901.8000001907349,3309,1942.800048828125);
  //
  drawLine2( 2916,1842,3155,1901.8000001907349);
  //5406
  drawLine2( 2968,1636,2916,1842);
  //5405
  drawLine2(3008,1473,2968,1636);
  //5404
  drawLine2(3091,1194.6000061035156,3008,1473);
  //5594
  drawLine2(2886,1460,3008,1473);
  //5563
  drawLine2( 2762,1467,2886,1460);
  //5564 5565 5593 5592
  drawLine2( 2613,1466,2762,1467);
  //
  drawLine2(2613,1466,2463,1470);
  //5568 5569 5588 5589
  drawLine2(2166,1470,2463,1470);
  //5570 5571 5586 5587
  drawLine2(1924,1461.4000244140625,2166,1470);
  //5573 5572 5585 5584
  drawLine2(1681,1467.5999755859375,1924,1461.4000244140625);
  //5575 5574 5583
  drawLine2(1440,1468,1681,1467.5999755859375);
  //5581 5580
  drawLine2(1193,1470.1999969482422,1440,1468);
  //5578
  drawLine2(1138,1296,1193,1470.1999969482422);
  //
  drawLine2(1147,1198,1138,1296);
  //5577
  drawLine2(1269,1192.2000007629395,1147,1198);
  //1-5ST-A
  drawLine2( 1363,1185.599998474121,1269,1192.2000007629395);
  //
  drawLine2(1147,1198,1148,991);
  //1-5W-SE
  drawLine2(1479,1199.6000061035156,1363,1185.599998474121);
  //1-5ER-A
  drawLine2(1844,1191,1479,1199.6000061035156);
  //5557
  drawLine2(2294,1196.4000244140625,1844,1191);
  //5566
  drawLine2(2294,1196.4000244140625,2459,1196);
  //5558
  drawLine2(2597,1195,2459,1196);
  //5559 5560
  drawLine2(2736,1199,2597,1195);
  //5561
  drawLine2(2889,1204,2736,1199);
  //5562
  drawLine2(2892,1336,2889,1204);
  //
  drawLine2(2892,1336,2886,1460);;
  //
  drawLine2(3648,2033,3488,1995);
  //1-5PE-10,11,6,7
  drawLine2(3689,1874.2000122070312,3648,2033);
  //1-5PE-8,9,5,4
  drawLine2(3759,1638,3689,1874.2000122070312);
  //
  drawLine2(3802,1460,3759,1638);
  //
  drawLine2(3802,1460,3592,1375);

  drawLine2(4032,1544.6000061035156,3802,1460)
  //5200
  drawLine2(4128,1141,4032,1544.6000061035156);
  //
  drawLine2(4175,1018,4128,1141);
  //
  drawLine2(3838,919,4175,1018);
  //
  drawLine2(3651,843,3838,919);
  //
  drawLine2(3680,744,3651,843);
  //5204
  drawLine2(4001,1647,4032,1544.6000061035156);
  //
  drawLine2(3865,2107,4001,1647);
  //
  drawLine2(3865,2107,3648,2033);
  //5208A
  drawLine2(4000,2138.7999877929688,3865,2107);
  //
  drawLine2(4121,2184,4000,2138.7999877929688);
  //5107 5108
  drawLine2( 4150,2126,4121,2184);
  //5208
  drawLine2(4168,2034,4150,2126);
  //5206 5207 5105 5106
  drawLine2(4208,1896,4168,2034);
  //5103 5104 5205
  drawLine2(4283,1633,4208,1896);
  //
  drawLine2(4283,1633,4032,1544.6000061035156)
  //5101 5102 5203 5204
  drawLine2(4345,1430,4283,1633)
  //5100B 5201
  drawLine2(4406,1214.2000122070312,4345,1430);
  //5100A
  drawLine2(4439,1090,4406,1214.2000122070312);
  //
  drawLine2(4175,1018,4439,1090);
  //............................//
  //5408
  drawLine2(2854,2036,2916,1842);
  //5409 5410
  drawLine2(2810,2180,2854,2036);
  //5411 5412
  drawLine2(2752,2411,2810,2180);
  //5413
  drawLine2(2688,2631.199996948242,2752,2411);
  //5414 5415
  drawLine2(2643,2750,2688,2631.199996948242)
  //5601 5626 5627
  drawLine2(2539,2751.199951171875,2643,2750);
  //5602 5625
  drawLine2(2313,2747.5999755859375,2539,2751.199951171875);
  //5603 5604 5624 5623
  drawLine2(2172,2752.800048828125,2313,2747.5999755859375);
  //5605 5606 5621 4522
  drawLine2(1923,2749.800048828125,2172,2752.800048828125);
  //5607 5608 5620 5619
  drawLine2(1679,2748.2000122070312,1923,2749.800048828125);
  //5609 5610 5617 5618
  drawLine2(1431,2747.4000244140625,1679,2748.2000122070312);
  //5611 5612 5616-01
  drawLine2(1203,2749.800048828125,1431,2747.4000244140625);
  //
  drawLine2(1131,2747.800048828125,1203,2749.800048828125);
  //5613 5614
  drawLine2(1133,2830,1131,2747.800048828125);
  //5615
  drawLine2(1142,2978.199951171875,1133,2830);
  //
  drawLine2(1140,3032.7999877929688,1142,2978.199951171875);
  //5616-02
  drawLine2(1267,3031.800048828125,1140,3032.7999877929688);
  //5631 5632
  drawLine2(1131,3251.60009765625,1140,3032.7999877929688);
  //
  drawLine2(1142,3497.199951171875,1131,3251.60009765625);
  //5644
  drawLine2(1260,3488.4000244140625,1142,3497.199951171875);
  //1-5ST-B
  drawLine2(1367,3490.199951171875,1260,3488.4000244140625);
  //1-5W-NE women
  drawLine2(1479,3491.5999755859375,1367,3490.199951171875);
  //1-5ER-B
  drawLine2(1852,3491.199951171875,1479,3491.5999755859375);
  //5629
  drawLine2(2135,3488.5999755859375,1852,3491.199951171875);
  //5636
  drawLine2(2308,3490,2135,3488.5999755859375);
  //5635
  drawLine2(2380,3485,2308,3490);
  //
  drawLine2(2329,5846,2386,5632)
  //
  drawLine2(2452,3487.5999755859375,2380,3485)
  //5421 5422
  drawLine2(2447,3538,2452,3487.5999755859375);
  //5423 5424
  drawLine2(2371,3761,2447,3538);
  //5637 5638 5658 5657
  drawLine2(2163,3764,2371,3761);
  //5639 5640 5656 5655
  drawLine2(1925,3764.5999755859375,2163,3764);
  //5641 5642 5654 5653
  drawLine2(1680,3761.800048828125,1925,3764.5999755859375);
  //5643 5652 5651
  drawLine2(1439,3762.199951171875,1680,3761.800048828125);
  //5644 5650
  drawLine2(1251,3759.5999755859375,1439,3762.199951171875);
  //5649 5648
  drawLine2(1148,3758.199951171875,1251,3759.5999755859375);
  //5647 5646
  drawLine2(1145,3625.60009765625,1148,3758.199951171875)
  //
  drawLine2(1142,3497.199951171875,1145,3625.60009765625);
  //1-5CR-B
  drawLine2(1378,3019.4000244140625,1267,3031.800048828125);
  //1-5M-NE men
  drawLine2(1467,3029.5999755859375,1378,3019.4000244140625);
  //1-5FR-B fan room
  drawLine2(1794,3025.800048828125,1467,3029.5999755859375);
  //5628
  drawLine2(2377,3023.60009765625,1794,3025.800048828125);
  //5416 5417
  drawLine2(2576,3023,2377,3023.60009765625)
  //
  drawLine2(2643,2750,2576,3023);
  //
  drawLine2(2521,3254.199951171875,2576,3023);
  //5317
  drawLine2(2733,3281.199951171875,2521,3254.199951171875)
  //
  drawLine2(3034,3342.800048828125,2733,3281.199951171875);
  //1-5PE-12,13,14,15 15SE-5 15SE-16
  drawLine2(3202,3389,3034,3342.800048828125);
  //1-5ST-C 5320 5321
  drawLine2(2967,3565,3034,3342.800048828125);
  //1-5ER-C 5322 5323
  drawLine2(2902,3796.199951171875,2967,3565);
  //5324 5201
  drawLine2(2854,4005,2902,3796.199951171875);
  //
  drawLine2(2809,4113,2854,4005);
  //5325
  drawLine2(2554,4046.60009765625,2809,4113);
  //
  drawLine2(2554,4046.60009765625,2809,4113);
  //5020
  drawLine2(3253,4248.60009765625,2809,4113);
  //
  drawLine2(2554,4046.60009765625,2320,3978.800048828125)
  
  //1-5FR-C
  drawLine2(3374,3840.199951171875,3278,4183);
  //1-5CR-C
  drawLine2(3412,3691.800048828125,3374,3840.199951171875);
  //5218
  drawLine2(3511,3361.199951171875,3412,3691.800048828125);
  //
  drawLine2(3532,3265.199951171875,3511,3361.199951171875);
  //5011
  drawLine2(3404,3217,3532,3265.199951171875);
  //5012
  drawLine2(3285,3187.5999755859375,3404,3217);
  //
  drawLine2(3088,3140.800048828125,3285,3187.5999755859375);
  //
  drawLine2(3088,3140.800048828125,3034,3342.800048828125);
  //5315 5316
  drawLine2(3110,3041.39990234375,3088,3140.800048828125);
  //5313 5314
  drawLine2(3186,2800,3110,3041.39990234375);
  //5311 5312 15ER-D
  drawLine2(3246,2554.5999755859375,3186,2800);
  //5309 5310
  drawLine2(3320,2319,3246,2554.5999755859375);
  //
  drawLine2(3356,2177,3320,2319);
  //
  drawLine2(3670,2798.199951171875,3532,3265.199951171875);
  //1-5FR-D
  drawLine2(3715,2604,3670,2798.199951171875);
  //
  drawLine2(3839,2187.199951171875,3715,2604);
  //5208 A-B
  drawLine2(3839,2187.199951171875,3715,2604);
  //5209
  drawLine2(4099,2278.5999755859375,4121,2184);
  //5210 5211
  drawLine2(4040,2482,4099,2278.5999755859375);
  //5110 5111
  drawLine2(4033,2539.400001525879,4040,2482);
  //5212 5213 5112 5113
  drawLine2(3969,2734.3999938964844,4033,2539.400001525879);
  //5214 5215 5114 5115
  drawLine2(3905,2974,3969,2734.3999938964844);
  //
  drawLine2(3835,3210,3905,2974);
  //
  drawLine2(3795,3338.60009765625,3835,3210);
  //
  drawLine2(3532,3265.199951171875,3795,3338.60009765625);
  //5218 5119
  drawLine2(3771,3438.199951171875,3795,3338.60009765625);
  //5219 5220
  drawLine2(3725,3628,3771,3438.199951171875);
  //5120 5121
  drawLine2(3702,3711,3725,3628);
  //5221 5222
  drawLine2(3656,3864.60009765625,3702,3711);
  //
  drawLine2(3632,3951,3656,3864.60009765625)
  //5122 5123
  drawLine2(3583,4110.39990234375,3632,3951);
  //5223 5224
  drawLine2(3587,4110.800048828125,3583,4110.39990234375);
  //5124 5125
  drawLine2(3568,4187.199951171875,3587,4110.800048828125);
  //
  drawLine2(3518,4330.60009765625,3568,4187.199951171875);
  //
  drawLine2(3518,4330.60009765625,3253,4248.60009765625);
  //5250 5150
  drawLine2(3478,4462.199951171875,3518,4330.60009765625);
  //5251 5151 5252 5152
  drawLine2(3444,4612.60009765625,3478,4462);
  //
  drawLine2(3393,4790,3444,4612.60009765625);
  //5153A 5153
  drawLine2(3520,4839.60009765625,3393,4790);
  //5154 5253
  drawLine2(3521,4921.199951171875,3520,4839.60009765625);
  //5254
  drawLine2(3497,5025.60009765625,3521,4921.199951171875);
  //5255 5155 5256 5156
  drawLine2(3449,5195,3497,5025.60009765625);
  //5257 5158 5258 5159
  drawLine2(3372,5471,3449,5195);
  //
  drawLine2(3323,5639,3372,5471);
  //5160 5161
  drawLine2(3305,5700.60009765625,3323,5639);
  //5280
  drawLine2(3105,5595,3323,5639);
  //
  drawLine2(2902,5549,3105,5595);
  //2-C5265
  drawLine2(2675,5472.39990234375,2902,5549);
  //
  drawLine2(2444,5412.39990234375,2675,5472.39990234375);
  //5363 5364
  drawLine2(2444,5412.39990234375,2386,5632);
  //5362
  drawLine2(2493,5237,2444,5412.39990234375);
  //5361
  drawLine2(2532,5119,2493,5237);
  //5359 5360 2-5CR-2A
  drawLine2(2567,4981,2532,5119);
  //5355 2-5FR-2A
  drawLine2(2608,4814.60009765625,2567,4981);
  //
  drawLine2(2678,4589.60009765625,2608,4814.60009765625);
  //5354
  drawLine2(2705,4510.39990234375,2678,4589.60009765625);
  //5033 5032
  drawLine2(2848,4631.199951171875,2678,4589.60009765625);
  //
  drawLine2(2999,4676,2848,4631.199951171875)
  //
  drawLine2(2739,4379.199951171875,2705,4510.39990234375);
  //5350 5351
  drawLine2(2592,4340.800048828125,2739,4379.199951171875);
  //
  drawLine2(2251,4232,2592,4340.800048828125);
  //
  drawLine2(2320,3978.800048828125,2251,4232);
  //5366
  drawLine2(2101,5572,2386,5632);
  //
  drawLine2(1875,5535,2101,5572);
  //5465 5467
  drawLine2(1792,5790.199951171875,1875,5535);
  //5463 5464
  drawLine2(1923,5326.39990234375,1875,5535);
  //5461 5462
  drawLine2(2000,5068,1923,5326.39990234375);
  //
  drawLine2(1668,5324,1923,5326.39990234375)
  //5459 5460
  drawLine2(2072,4833,2000,5068);
  //5335-01
  drawLine2(2143,4594.60009765625,2072,4833);
  //5700 5701
  drawLine2(1874,5043,2000,5068);
  //5712 5711
  drawLine2(1798,5046,1874,5043);
  //5702 5710
  drawLine2(1611,5040,1798,5046);
  //5703
  drawLine2(1533,5041,1611,5040);
  //5705 5706
  drawLine2(1405,5045,1533,5041);
  //5704
  drawLine2(1400,4913,1405,5045);
  //5707 5709
  drawLine2(1404,5220,1405,5045);
  //
  drawLine2(1399,5335,1404,5220);
  //5721 5720
  drawLine2(1668,5324,1399,5335)
  //5722 5723
  drawLine2(1376,5540,1399,5335);
  //
  drawLine2(1393,5757,1376,5540);
  //5725 5724 5727 5731
  drawLine2(1671,5763,1393,5757);
  //
  drawLine2(1792,5790.199951171875,1671,5763);
  //5732
  drawLine2(1390,5828.2001953125,1393,5757);
  //
  drawLine2(1403,5976,1390,5828.2001953125);
  //5733 5734
  drawLine2(1398,6048,1403,5976);
  //5735
  drawLine2(1403,6190,1398,6048);
  //
  drawLine2(1743,5978,1589,5977);
  //5468 5469
  drawLine2(1730,6030.800048828125,1743,5978);
  //5470
  drawLine2(1668,6238,1730,6030.800048828125);
  //
  drawLine2(1658,6305,1668,6238);
  //5801 5802
  drawLine2(1846,6360,1658,6305);
  //5370 5803 5804
  drawLine2(2092,6424,1846,6360);
  //
  drawLine2(2169,6439,2092,6424);
  //
  drawLine2(2324,6481,2169,6439);

  //5368 5369 5CR-2B 2-5ER-2B
  drawLine2(2236,6172,2169,6439);
  //5365 5367 2-5JC-2B
  drawLine2(2296,5939,2236,6172);
  //
  drawLine2(2329,5846,2296,5939)
  //
  drawLine2(1743,5978,1792,5790.199951171875)
  //5736
  drawLine2(1464,5979,1403,5976);
  //5730
  drawLine2(1589,5977,1464,5979)
  //5277 5278
  drawLine2(2947,5352,2902,5549);
  //5275 5276 25ST-2A
  drawLine2(3019,5100,2947,5352);
  //5274
  drawLine2(3073,4902,3019,5100);
  //5273
  drawLine2(3106,4792,3073,4902);
  //
  drawLine2(3132,4708.60009765625,3106,4792);
  //
  drawLine2(2999,4676,3132,4708.60009765625);
  //
  drawLine2(3393,4790,3132,4708.60009765625);
  //
  drawLine2(3213,4405.199951171875,3106,4792);
  //5030
  drawLine2(3532,3265.199951171875,3213,4405.199951171875);
  //
  drawLine2(2828,5755.199951171875,2902,5549);
  //
  drawLine2(2598,5684,2828,5755.199951171875);
  //2-5PE-17 to 22
  drawLine2( 2386,5632,2598,5684);
  //5283
  drawLine2(2794,5914.7998046875,2828,5755.199951171875);
  //5284 5285 2-5SE-2
  drawLine2(2761,6057.199951171875,2794,5914.7998046875);
  //2-5FR-2B
  drawLine2(2730,6134,2761,6057.199951171875);
  //5286 5287
  drawLine2(2685,6296,2730,6134);
  //
  drawLine2(2604,6561,2685,6296);
  //5808 5809
  drawLine2(2678,6584,2604,6561);
  //5040 5807
  drawLine2(2471,6531,2604,6561);
  //5041 5042 5806 5805
  drawLine2(2324,6481,2471,6531);
  //5288
  drawLine2(2793,6619,2678,6584);
  //5810 5268
  drawLine2(2894,6638,2793,6619);
  //
  drawLine2(2982,6680,2894,6638);
  //5811
  drawLine2(2937,6820,2982,6680);
  //5168 5812
  drawLine2(3032,6628,2982,6680);
  //5266 5267 5166 5167
  drawLine2(3106,6410,3032,6628);
  //5164 5165 5264 5265
  drawLine2(3174,6174,3106,6410);
  //5263 5162 5163
  drawLine2(3238,5937,3174,6174);
  //
  drawLine2(3305,5700.60009765625,3238,5937)
  // ...............................................//
  //
  drawLine2(2447,3538,2521,3254.199951171875)
  //
  drawLine2(2320,3978.800048828125,2371,3761)
});
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
