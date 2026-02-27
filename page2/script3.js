let font;
let points = [];

let msg = "PAST";
let fontSize = 200;


let overload = 0;

function preload() {
 
  font = loadFont("ArchivoBlack-Regular.ttf");
}

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("sketch-container");

  
  let bounds = font.textBounds(msg, 0, 0, fontSize);

  
  let x = (width - bounds.w) / 2 - bounds.x;
  let y = (height - bounds.h) / 2 - bounds.y;

  
  let rawPts = font.textToPoints(msg, x, y, fontSize, {
    sampleFactor: 0.12,
    simplifyThreshold: 0
  });

  
  points = rawPts.map(p => ({
    x: p.x,
    y: p.y,
    char: random(["/", "\\", "|", "-", "_"])
  }));
}

function draw() {
  background(6);
  noStroke();
  textFont("Courier New");

  
  if (mouseIsPressed) overload += 2;
  else overload = max(0, overload - 2);

  for (const pt of points) {
    
    const jx = random(-overload, overload);
    const jy = random(-overload, overload);
    const px = pt.x + jx;
    const py = pt.y + jy;

    
    const d = dist(px, py, mouseX, mouseY);
    const glow = max(0, 1 - d / 120);

    textSize(8 + glow * 12);
    fill(20 + glow * 80, 255, 20, (0.4 + glow * 0.6) * 255);

    
    const charToDraw = glow > 0.3 ? "-" : pt.char;
    text(charToDraw, px, py);
  }
}