function handleObstacle3(mover) {
  if (!firstStuckPlayer) {
    firstStuckPlayer = mover;
  }
  playerStuck[mover] = true;
  const randomNumLabel = document.getElementById('randomNum');
  if (playerRole === mover) {
    randomNumLabel.textContent = `You are stuck in a swamp. Your next turn will be skipped.`;
  } else {
    randomNumLabel.textContent = `${mover} is stuck in a swamp. Their next turn is skipped.`;
  }
  randomNumLabel.style.opacity = 1;
  if (firstStuckPlayer !== mover) {
    socket.emit('skipTurn', mover);
  }
}
