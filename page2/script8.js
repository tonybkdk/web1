let font;
let fontSize = 150;
let msg = "CODE";


let points = [];
let mouseInfluenceRadius = 120;
let waveStrength = 60;

function preload() {
  font = loadFont("ArchivoBlack-Regular.ttf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-container");

  
  let rawPts = font.textToPoints(msg, 100, 300, fontSize, {
    sampleFactor: 0.12,
    simplifyThreshold: 0,
  });

  points = rawPts.map((p) => ({
    ox: p.x,
    oy: p.y,
    x: p.x,
    y: p.y,
    vx: 0,
    vy: 0,
  }));
}

function draw() {
  background(400);

  for (let pt of points) {
    
    let dx = pt.ox - mouseX;
    let dy = pt.oy - mouseY;
    let d = sqrt(dx * dx + dy * dy);

    
    let force = exp(
      (-d * d) / (mouseInfluenceRadius * mouseInfluenceRadius * 0.3)
    );

    let targetX = pt.ox + (dx / (d + 1)) * force * waveStrength;
    let targetY = pt.oy + (dy / (d + 1)) * force * waveStrength;

    
    pt.vx += (targetX - pt.x) * 0.2;
    pt.vy += (targetY - pt.y) * 0.2;
    pt.vx *= 0.6;
    pt.vy *= 0.6;

    pt.x += pt.vx;
    pt.y += pt.vy;

    
    ellipse(pt.x, pt.y, 3);
  }
}