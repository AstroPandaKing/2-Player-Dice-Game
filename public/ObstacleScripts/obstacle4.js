function handleObstacle4(mover) {
  let tempPosition = redPieceCurrentPosition;
  redPieceCurrentPosition = bluePieceCurrentPosition;
  bluePieceCurrentPosition = tempPosition;
  updatePiecePosition('Player 1');
  updatePiecePosition('Player 2');
  socket.emit('teleportObstacle', 'Obstacle 4');
}
function updatePiecePosition(player) {
  const position =
    player === 'Player 1' ? redPieceCurrentPosition : bluePieceCurrentPosition;
  const piece = document.getElementById(
    player === 'Player 1' ? 'RedPiece' : 'BluePiece'
  );
  const gridPos = gridPositions[position];

  if (gridPos) {
    piece.style.left = `${gridPos.centerX - piece.width / 2}px`;
    piece.style.top = `${gridPos.centerY - piece.height / 2}px`;
  }
}
