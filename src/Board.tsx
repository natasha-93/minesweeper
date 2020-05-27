import * as React from "react";
import { BoardType } from "./models/Board";
import { GameStatus } from "./models/GameStatus";
import Cell from "./Cell";

export interface BoardProps {
  board: BoardType;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
}

const Board: React.SFC<BoardProps> = ({
  board,
  gameStatus,
  onReveal,
  onToggleFlag,
}) => {
  return (
    <div>
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
                  onReveal={onReveal}
                  onToggleFlag={onToggleFlag}
                  gameStatus={gameStatus}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
