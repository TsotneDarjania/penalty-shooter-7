// Select the canvas element
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Create a new image object
const img = new Image();
const pngImage = new Image();

// Set the image source
img.src = "image/example.jpg"; // Replace with your image path
img.src = "image/example.png"; // Replace with your image path

// Once the image is loaded, draw it on the canvas
img.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 500, 0, canvas.width, canvas.height);
};
