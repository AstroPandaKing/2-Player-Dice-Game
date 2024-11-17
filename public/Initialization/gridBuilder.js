const gameArea = document.querySelector('.gridArea');
gameArea.textContent = 'hello World';

document.addEventListener('DOMContentLoaded', init);
const game = { row: 7, col: 7 };

let cellHeight = 0;

function init() {
  gameArea.innerHTML = '';
  const main = createNewElement(gameArea, 'div', '', 'gridContainer');

  buildGrid(main);
}

function buildGrid(main) {
  let columns = 'auto '.repeat(game.col).trim();
  let rows = 'auto '.repeat(game.row).trim();

  main.style.display = 'grid';
  main.style.gridTemplateColumns = columns;
  main.style.gridTemplateRows = rows;

  const cellPositions = {};

  for (let y = 0; y < game.row; y++) {
    for (let x = 0; x < game.col; x++) {
      const cellNumber = (game.row - 1 - y) * game.col + x + 1;
      const cell = createNewElement(main, 'div', cellNumber, 'grid-item');
      requestAnimationFrame(() => {
        const rect = cell.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        cellPositions[cellNumber] = { centerX, centerY };

        if (y === 0 && x === 0) {
          cellHeight = rect.height; 
          updatePieceSize(cellHeight);
        }
      });
    }
  }

  socket.emit('gridValues', cellPositions);
}

function createNewElement(parent, ele, html, myClass) {
  const el = document.createElement(ele);
  el.classList.add(myClass);
  el.innerHTML = html;
  parent.append(el);
  return el;
}

function updatePieceSize(cellHeight) {
  const pieces = document.querySelectorAll('.Piece');
  pieces.forEach((piece) => {
    piece.style.height = `${cellHeight * 0.9}px`;
  });
}
