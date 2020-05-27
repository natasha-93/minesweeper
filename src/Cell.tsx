import React from "react";
import { ICell } from "./models/Cell";
import { GameStatus } from "./models/GameStatus";
import CellIcon from "./CellIcon";

export type CellProps = {
  cell: ICell;
  rowIndex: number;
  colIndex: number;
  gameStatus: GameStatus;
  onReveal: (rowIndex: number, colIndex: number, cell: ICell) => void;
  onToggleFlag: (rowIndex: number, colIndex: number, cell: ICell) => void;
};

const Cell: React.FC<CellProps> = ({
  cell,
  rowIndex,
  colIndex,
  gameStatus,
  onReveal,
  onToggleFlag,
}) => {
  return (
    <button
      disabled={cell.status === "REVEALED" || gameStatus !== "ACTIVE"}
      style={{ minWidth: "2rem", minHeight: "2rem", verticalAlign: "top" }}
      onContextMenu={(e) => {
        e.preventDefault();

        if (cell.status !== "REVEALED") {
          onToggleFlag(rowIndex, colIndex, cell);
        }
      }}
      onClick={(e) => {
        if (cell.status === "UNREVEALED") {
          onReveal(rowIndex, colIndex, cell);
        }
      }}
    >
      <CellIcon
        flagged={cell.status === "FLAGGED"}
        visible={cell.status === "REVEALED" || gameStatus !== "ACTIVE"}
        value={cell.value}
      />
    </button>
  );
};

export default Cell;
