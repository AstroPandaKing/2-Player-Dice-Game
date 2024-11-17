const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

app.use(express.static('public'));

let gridCoords = {};
let playerCount = 0;
let currentTurn = 'Player 1';
let teleportInProgress = false;

function generateObstacles() {
  const obstacles = [];
  const maxTile = 49;
  const excludedPositions = [1, 49];

  while (obstacles.length < 4) {
    let randomPos = Math.floor(Math.random() * (maxTile - 1)) + 1;
    if (
      !excludedPositions.includes(randomPos) &&
      !obstacles.some((obstacle) => obstacle.position === randomPos)
    ) {
      obstacles.push({
        position: randomPos,
        name: `Obstacle ${obstacles.length + 1}`,
        imagePath: `images/Obstacles/obstacle${obstacles.length + 1}.png`,
      });
    }
  }
  return obstacles;
}

let obstacles = generateObstacles();

io.on('connection', (socket) => {
  if (playerCount >= 2) {
    socket.emit('redirect', { message: 'Game is full!' });
    socket.disconnect();
    return;
  }

  playerCount++;

  if (playerCount === 1) {
    socket.emit('playerRole', 'Player 1');
    socket.playerRole = 'Player 1';
  } else if (playerCount === 2) {
    socket.emit('playerRole', 'Player 2');
    socket.playerRole = 'Player 2';
    io.emit('turn', 'Player 1');
  }
  socket.on('teleportObstacle', (obstacleName) => {
    if (teleportInProgress) return;
    teleportInProgress = true;

    const obstacle = obstacles.find((obs) => obs.name === obstacleName);
    if (obstacle) {
      let newPos;

      do {
        newPos = Math.floor(Math.random() * 49) + 1;
      } while (
        newPos === 1 ||
        newPos === 49 ||
        obstacles.some((obs) => obs.position === newPos)
      );
      obstacle.position = newPos;
      io.emit('updateObstacle', obstacle);

      setTimeout(() => {
        teleportInProgress = false;
      }, 1000);
    }
  });

  socket.on('gridValues', (gridValues) => {
    gridCoords = { ...gridValues };
    socket.emit('gridPositions', gridCoords);
  });

  socket.on('randomNumber', (randomNumber, randomNumberTwo, mover) => {
    if (socket.playerRole === currentTurn) {
      const otherPlayer = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
      io.emit(
        'randomReceive',
        randomNumber,
        randomNumberTwo,
        mover,
        otherPlayer
      );
      currentTurn = currentTurn === 'Player 1' ? 'Player 2' : 'Player 1';
      io.emit('turn', currentTurn);
    }
  });
  socket.on('move', ({ mover, steps }) => {
    io.emit('movePiece', { mover, steps });
  });

  socket.on('disconnect', () => {
    if (socket.playerRole) {
      playerCount--;
      currentTurn = 'Player 1';
      io.emit('playerDisconnected', socket.playerRole);
    }
  });

  socket.on('endTurn', (mover) => {
    currentTurn = mover === 'Player 1' ? 'Player 2' : 'Player 1';
    io.emit('turn', currentTurn);
  });
  socket.on('skipTurn', (mover) => {
    if (currentTurn === mover) {
      const nextPlayer = mover === 'Player 1' ? 'Player 2' : 'Player 1';
      io.emit('turnSkipped', { skippedPlayer: mover });
      currentTurn = nextPlayer;
      io.emit('turn', currentTurn);
    }
  });

  socket.emit('obstacles', obstacles);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
