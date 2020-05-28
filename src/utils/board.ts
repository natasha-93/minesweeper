import { cloneDeep, range, shuffle, chunk } from "lodash";
import { BoardType } from "../models/Board";
import { ICell, CellValue, CellCoordinates } from "../models/Cell";

export const findCellCoords = (
  board: BoardType,
  isMatch: (cell: ICell) => boolean
): CellCoordinates | null => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (isMatch(board[row][col])) {
        return {
          row,
          col,
        };
      }
    }
  }

  return null;
};

export const updateCell = (
  board: BoardType,
  rowIndex: number,
  colIndex: number,
  transform: (cell: ICell) => ICell
): BoardType => {
  const newBoard: BoardType = board.map((row, i) => {
    return row.map((cell, j) => {
      if (rowIndex !== i || colIndex !== j) {
        return cell;
      }

      return transform(cell);
    });
  });

  return newBoard;
};

export const forEachNeighbor = (
  board: BoardType,
  rowIndex: number,
  colIndex: number,
  callback: (coords: CellCoordinates) => void
): void => {
  const deltas = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  deltas.forEach(([dX, dY]) => {
    const row = rowIndex + dY;
    const col = colIndex + dX;

    if (Array.isArray(board[row]) && board[row][col] != null) {
      callback({ row, col });
    }
  });
};

export const isNumCell = (cell: ICell): boolean =>
  ["0", "1", "2", "3", "4", "5", "6", "7", "8"].includes(cell.value);

export const updateNeighborCounts = (
  board: BoardType,
  rowIndex: number,
  colIndex: number,
  change: "increase" | "decrease"
) => {
  forEachNeighbor(board, rowIndex, colIndex, ({ row, col }) => {
    if (!isNumCell(board[row][col])) return;

    const n = Number(board[row][col].value);

    if (change === "increase") {
      board[row][col].value = String(n + 1) as CellValue;
    } else {
      board[row][col].value = String(n - 1) as CellValue;
    }
  });
};

export const createBoard = (size: number, bombCount: number): BoardType => {
  const cells: ICell[] = range(0, size * size).map((cell, i) => ({
    status: "UNREVEALED",
    value: i < bombCount ? "B" : "0",
  }));

  const board = chunk(shuffle(cells), size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j].value === "B") {
        forEachNeighbor(board, i, j, ({ row, col }) => {
          const cell = board[row][col];

          if (cell.value === "B") return;

          board[row][col].value = String(Number(cell.value) + 1) as CellValue;
        });
      }
    }
  }

  return board;
};

// Mutates board with all adjacent empties marked as revealed
const revealNeighborsRecursive = (
  board: BoardType,
  rowIndex: number,
  colIndex: number
): BoardType => {
  if (rowIndex < 0 || rowIndex > board.length - 1) return board;
  if (colIndex < 0 || colIndex > board[0].length - 1) return board;

  const cell = board[rowIndex][colIndex];

  if (cell.status !== "UNREVEALED") return board;
  if (cell.value === "B") return board;

  board[rowIndex][colIndex].status = "REVEALED";

  if (cell.value !== "0") return board;

  revealNeighborsRecursive(board, rowIndex - 1, colIndex);
  revealNeighborsRecursive(board, rowIndex, colIndex + 1);
  revealNeighborsRecursive(board, rowIndex + 1, colIndex);
  revealNeighborsRecursive(board, rowIndex, colIndex - 1);

  return board;
};

export const revealNeighbors = (
  board: BoardType,
  rowIndex: number,
  colIndex: number
): BoardType => {
  const newBoard = revealNeighborsRecursive(
    cloneDeep(board),
    rowIndex,
    colIndex
  );

  // ensure the first click reveals the cell
  newBoard[rowIndex][colIndex].status = "REVEALED";

  return newBoard;
};

export const countCells = (
  board: BoardType,
  shouldCount: (cell: ICell) => boolean
) => {
  const count = board.reduce((boardCount, row) => {
    const rowCount = row.reduce(
      (rowCount, cell) => rowCount + (shouldCount(cell) ? 1 : 0),
      0
    );

    return boardCount + rowCount;
  }, 0);

  return count;
};

export const countNeighbors = (
  board: BoardType,
  rowIndex: number,
  colIndex: number,
  shouldCount: (cell: ICell) => boolean
) => {
  let total = 0;

  forEachNeighbor(board, rowIndex, colIndex, ({ row, col }) => {
    if (shouldCount(board[row][col])) {
      total++;
    }
  });

  return total;
};

export const countAdjacentBombs = (
  board: BoardType,
  rowIndex: number,
  colIndex: number
): number => {
  return countNeighbors(
    board,
    rowIndex,
    colIndex,
    (cell) => cell.value === "B"
  );
};
