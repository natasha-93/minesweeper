import { cloneDeep, range, shuffle, chunk } from "lodash";
import { BoardType } from "../models/Board";
import { ICell, CellValue } from "../models/Cell";

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

export const updateNeighbors = (
  board: BoardType,
  rowIndex: number,
  colIndex: number,
  update: (row: number, col: number) => void
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
    const x = colIndex + dX;
    const y = rowIndex + dY;

    if (Array.isArray(board[y]) && board[y][x] != null) {
      update(x, y);
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
        updateNeighbors(board, i, j, (column, row) => {
          const cell = board[row][column];

          if (cell.value === "B") return;

          board[row][column].value = String(
            Number(cell.value) + 1
          ) as CellValue;
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
