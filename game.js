const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración inicial del canvas
canvas.width = 400;
canvas.height = 600;

// Variables del juego
let score = 0;
let gameSpeed = 1;
let speedBoostActive = false;
let boostTime = 0;
let banana = { x: 50, y: 300, width: 40, height: 40, dy: 0 };
let obstacles = [];
let isGameOver = false;

// Cargar imagen del plátano
const bananaImage = new Image();
bananaImage.src = 'banana.png';  // Asegúrate de tener la imagen en la carpeta correcta

// Función para crear un nuevo obstáculo
function createObstacle() {
    const gap = 150;
    const obstacleWidth = 40;
    const topHeight = Math.random() * (canvas.height - gap);
    const bottomHeight = canvas.height - topHeight - gap;
    obstacles.push({ x: canvas.width, topHeight, bottomHeight, width: obstacleWidth });
}

// Función para actualizar la posición del plátano
function updateBanana() {
    if (banana.y + banana.height < canvas.height) {
        banana.dy += 0.5;  // Gravedad
    } else {
        banana.dy = 0;
        banana.y = canvas.height - banana.height;
    }
    banana.y += banana.dy;
}

// Función para dibujar el plátano
function drawBanana() {
    ctx.drawImage(bananaImage, banana.x, banana.y, banana.width, banana.height);
}

// Función para mover los obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    // Eliminar obstáculos fuera de pantalla
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Función para dibujar los obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight); // Parte superior del obstáculo
        ctx.fillRect(obstacle.x, canvas.height - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight); // Parte inferior del obstáculo
    });
}

// Función para comprobar colisiones
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (banana.x + banana.width > obstacle.x &&
            banana.x < obstacle.x + obstacle.width &&
            (banana.y < obstacle.topHeight || banana.y + banana.height > canvas.height - obstacle.bottomHeight)) {
            isGameOver = true;
        }
    });
}

// Función para actualizar el puntaje
function updateScore() {
    score++;
    if (score % 100 === 0) {
        speedBoostActive = true;
        boostTime = Date.now();
        removeObstacles();
    }
}

// Función para remover obstáculos temporalmente
function removeObstacles() {
    obstacles = [];
}

// Función para aumentar la velocidad
function updateGameSpeed() {
    if (speedBoostActive && Date.now() - boostTime < 3000) {
        gameSpeed = 2;  // Aumentar la velocidad
    } else {
        speedBoostActive = false;
        gameSpeed = 1;  // Restaurar la velocidad normal
    }
}

// Función principal de la lógica del juego
function gameLoop() {
    if (isGameOver) {
        alert('Game Over! Tu puntuación es ' + score);
        return;
    }

    updateScore();
    updateGameSpeed();
    updateBanana();
    updateObstacles();
    checkCollisions();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBanana();
    drawObstacles();

    requestAnimationFrame(gameLoop);
}

// Control del plátano (salto)
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        banana.dy = -10; // Salto
    }
});

// Crear obstáculos cada 1000 ms
setInterval(createObstacle, 1000);

gameLoop();  // Iniciar el juego
