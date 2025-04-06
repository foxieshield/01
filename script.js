// Obtenemos el canvas del HTML y su contexto para poder dibujar en él
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Definimos la forma de la pieza T
const matrix = [
  [1, 1, 1],
  [0, 1, 0]
];

// Creamos el "arena", el campo de juego vacío (12 columnas x 20 filas)
const arena = createMatrix(12, 20);

// Definimos al jugador con su pieza, posición inicial y puntuación
const player = {
  matrix: matrix,         // forma de la pieza
  pos: {x: 5, y: 0},       // posición en el tablero
  score: 0                // puntuación
};

// Variable para controlar el tiempo del juego
let lastTime = 0;

// Bucle principal del juego, se ejecuta muchas veces por segundo
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  
  // Hacemos que la pieza baje una unidad
  player.pos.y++;

  // Si colisiona con algo (el fondo o una pieza), la detenemos
  if (collides(arena, player)) {
    player.pos.y--;          // volvemos una posición atrás
    merge(arena, player);    // fusionamos la pieza con el fondo
    player.pos.y = 0;        // reseteamos la posición de Y
    player.pos.x = 5;        // y la posición X al centro
    player.matrix = matrix;  // volvemos a colocar una pieza nueva
  }

  // Dibujamos el estado actual del juego
  draw();

  // Llamamos de nuevo al update para que se repita constantemente
  requestAnimationFrame(update);
}

// Iniciamos el bucle del juego
requestAnimationFrame(update);

// Función que dibuja el estado actual
function draw() {
  // Fondo negro
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujamos las piezas ya colocadas en el fondo
  drawMatrix(arena, {x: 0, y: 0});

  // Dibujamos la pieza actual del jugador
  drawMatrix(player.matrix, player.pos);

  // Mostramos la puntuación en la esquina
  context.fillStyle = 'white';
  context.font = '1px monospace';
  context.fillText(`Score: ${player.score}`, 1, 1);
}

// Dibuja cualquier matriz (arena o pieza del jugador)
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        context.fillStyle = 'blue'; // Color de las piezas
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// Crea una matriz vacía de tamaño ancho x alto (arena vacía)
function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0)); // llena con ceros
  }
  return matrix;
}

// Verifica si hay colisión entre la pieza y el fondo
function collides(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      // Si hay una celda ocupada de la pieza y del fondo en la misma posición
      if (m[y][x] !== 0 && 
        (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true; // hay colisión
      }
    }
  }
  return false;
}

// Funde la pieza con la arena al tocar el fondo
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}
