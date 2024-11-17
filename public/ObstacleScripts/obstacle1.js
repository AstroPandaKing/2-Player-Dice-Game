function handleObstacle1(mover) {
  const backSteps = -10;
  let movingPiece;
  if (mover === 'Player 1') {
    redPieceCurrentPosition = Math.max(1, redPieceCurrentPosition + backSteps);
    const backPosition = gridPositions[redPieceCurrentPosition];
    movingPiece = document.getElementById('RedPiece');
    if (backPosition) {
      movingPiece.style.left = `${
        backPosition.centerX - movingPiece.width / 2
      }px`;
      movingPiece.style.top = `${
        backPosition.centerY - movingPiece.height / 2
      }px`;
    }
  } else {
    bluePieceCurrentPosition = Math.max(
      1,
      bluePieceCurrentPosition + backSteps
    );
    const backPosition = gridPositions[bluePieceCurrentPosition];
    movingPiece = document.getElementById('BluePiece');
    if (backPosition) {
      movingPiece.style.left = `${
        backPosition.centerX - movingPiece.width / 2
      }px`;
      movingPiece.style.top = `${
        backPosition.centerY - movingPiece.height / 2
      }px`;
    }
  }
  const randomNumLabel = document.getElementById('randomNum');
  if (mover === playerRole) {
    randomNumLabel.textContent = `You were hit by a rock and moved back 10 spaces.`;
  } else {
    randomNumLabel.textContent = `${mover} was hit by a rock and moved back 10 spaces.`;
  }
  socket.emit('endTurn', mover);
}
