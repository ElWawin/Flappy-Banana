const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const banana = new Image();
banana.src = "banana.png"; // Asegurate de tener esta imagen

let x = 50;
let y = 150;
let gravity = 2;
let lift = -30;
let velocity = 0;

let pipes = [];

function drawBanana() {
  ctx.drawImage(banana, x, y, 40, 40);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBanana();

  velocity += gravity;
  y += velocity;

  if (y > canvas.height - 40) {
    y = canvas.height - 40;
    velocity = 0;
  }

  if (y < 0) {
    y = 0;
    velocity = 0;
  }

  // Dibujo y movimiento de tubos
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    ctx.fillStyle = "green";
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, p.bottom, 40, canvas.height - p.bottom);

    // Colisiones simples
    if (x < p.x + 40 && x + 40 > p.x && (y < p.top || y + 40 > p.bottom)) {
      alert("Game Over!");
      document.location.reload();
    }
  }

  if (pipes.length == 0 || pipes[pipes.length - 1].x < 250) {
    let top = Math.random() * 200 + 50;
    let bottom = top + 120;
    pipes.push({ x: canvas.width, top: top, bottom: bottom });
  }

  requestAnimationFrame(update);
}

document.addEventListener("keydown", function () {
  velocity = lift;
});

banana.onload = () => {
  update();
};
