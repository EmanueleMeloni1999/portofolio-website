const tiger = document.getElementById("hero-tiger");

const totalFrames = 180;
const cols = 18;
const rows = 10;

let currentX = 0.5;
let currentY = 0.5;

const smoothing = 0.15;

const tigerFrames = [];
for (let i = 1; i <= totalFrames; i++) {
    const frameStr = i.toString().padStart(4, "0");
    const img = new Image();
    img.src = `assets/sprites/tiger_head/head.${frameStr}.webp`;
    tigerFrames.push(img);
}

document.addEventListener("mousemove", (e) => {
    const nx = e.clientX / window.innerWidth;
    const ny = e.clientY / window.innerHeight;

    currentX += (nx - currentX) * smoothing;
    currentY += (ny - currentY) * smoothing;

    let col = Math.floor(currentX * cols);
    let row = Math.floor(currentY * rows);

    col = Math.max(0, Math.min(cols-1, col));
    row = Math.max(0, Math.min(rows-1, row));

    let frameIndex = row * cols + col;
    frameIndex = Math.max(0, Math.min(totalFrames-1, frameIndex));

    tiger.src = tigerFrames[frameIndex].src;
});
