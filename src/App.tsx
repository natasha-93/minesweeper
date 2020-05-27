import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import { ICell } from "./models/Cell";
import Cell from "./Cell";

type Board = ICell[][];
type GameStatus = "WON" | "LOST" | "ACTIVE";

const defaultBoard: Board = [
  [
    { value: "B", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
  ],
  [
    { value: "1", status: "UNREVEALED" },
    { value: "2", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
  ],
  [
    { value: "0", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "B", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
  ],
  [
    { value: "0", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "1", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
  ],
  [
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
    { value: "0", status: "UNREVEALED" },
  ],
];

// Mutates board with all adjacent empties marked as revealed
const revealNeighborsRecursive = (
  board: Board,
  rowIndex: number,
  colIndex: number
): Board => {
  if (rowIndex < 0 || rowIndex > board.length - 1) return board;
  if (colIndex < 0 || colIndex > board[0].length - 1) return board;

  const cell = board[rowIndex][colIndex];

  if (cell.status !== "UNREVEALED") return board;
  if (cell.value !== "0") return board;

  board[rowIndex][colIndex].status = "REVEALED";

  revealNeighborsRecursive(board, rowIndex - 1, colIndex);
  revealNeighborsRecursive(board, rowIndex, colIndex + 1);
  revealNeighborsRecursive(board, rowIndex + 1, colIndex);
  revealNeighborsRecursive(board, rowIndex, colIndex - 1);

  return board;
};

const revealNeighbors = (
  board: Board,
  rowIndex: number,
  colIndex: number
): Board => {
  const newBoard = revealNeighborsRecursive(
    cloneDeep(board),
    rowIndex,
    colIndex
  );

  // ensure the first click reveals the cell
  newBoard[rowIndex][colIndex].status = "REVEALED";

  return newBoard;
};

const countCells = (board: Board, shouldCount: (cell: ICell) => boolean) => {
  const count = board.reduce((boardCount, row) => {
    const rowCount = row.reduce(
      (rowCount, cell) => rowCount + (shouldCount(cell) ? 1 : 0),
      0
    );

    return boardCount + rowCount;
  }, 0);

  return count;
};

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("ACTIVE");
  const [board, setBoard] = useState(defaultBoard);
  const revealedCount = countCells(board, (cell) => cell.status === "REVEALED");
  const flaggedCount = countCells(board, (cell) => cell.status === "FLAGGED");
  const bombCount = countCells(board, (cell) => cell.value === "B");

  useEffect(() => {
    if (gameStatus === "ACTIVE") return;

    if (gameStatus === "WON") {
      alert("You won!");
    } else if (gameStatus === "LOST") {
      alert("You lost!");
    }
  }, [gameStatus]);

  useEffect(() => {
    const revealedBombCount = countCells(
      board,
      (cell) => cell.value === "B" && cell.status === "REVEALED"
    );
    const boardSize = board.length * board[0].length;

    // Check if we've won/lost
    if (revealedBombCount > 0) {
      setGameStatus("LOST");
    } else if (boardSize - revealedCount === bombCount) {
      setGameStatus("WON");
    }
  }, [revealedCount]);

  const updateCell = (
    rowIndex: number,
    colIndex: number,
    transform: (cell: ICell) => ICell
  ): Board => {
    const newBoard: Board = board.map((row, i) => {
      return row.map((cell, j) => {
        if (rowIndex !== i || colIndex !== j) {
          return cell;
        }

        return transform(cell);
      });
    });

    return newBoard;
  };

  const reveal = (rowIndex: number, colIndex: number) => {
    const newBoard = revealNeighbors(board, rowIndex, colIndex);

    setBoard(newBoard);
  };

  const toggleFlag = (rowIndex: number, colIndex: number) => {
    const newBoard = updateCell(rowIndex, colIndex, (cell) => ({
      ...cell,
      status: cell.status === "FLAGGED" ? "UNREVEALED" : "FLAGGED",
    }));

    setBoard(newBoard);
  };

  return (
    <div>
      <h2>Minesweeper</h2>

      <p>Bombs left: {bombCount - flaggedCount}</p>

      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
            {row.map((cell, colIndex) => {
              return (
                <Cell
                  key={colIndex}
                  cell={cell}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onReveal={(rowIndex, colIndex) => reveal(rowIndex, colIndex)}
                  onToggleFlag={(rowIndex, colIndex) =>
                    toggleFlag(rowIndex, colIndex)
                  }
                />
              );
            })}
          </div>
        );
      })}

      <button
        onClick={(e) => {
          setGameStatus("ACTIVE");
          setBoard(defaultBoard);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
