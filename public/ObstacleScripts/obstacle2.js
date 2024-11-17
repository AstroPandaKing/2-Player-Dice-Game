function handleObstacle2(mover) {
  playerInjured[mover] = true;
  const randomNumLabel = document.getElementById('randomNum');
  if (playerRole === mover) {
    randomNumLabel.textContent =
      'You are injured! Your next move will be halved.';
  } else {
    randomNumLabel.textContent = `${mover} is injured! Their next move will be halved.`;
  }
}
