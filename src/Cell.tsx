import React from "react";
import { ICell } from "./models/Cell";

export type CellProps = {
  cell: ICell;
  rowIndex: number;
  colIndex: number;
  onReveal: (rowIndex: number, colIndex: number, cell: ICell) => void;
  onToggleFlag: (rowIndex: number, colIndex: number, cell: ICell) => void;
};

const Cell: React.FC<CellProps> = ({
  cell,
  rowIndex,
  colIndex,
  onReveal,
  onToggleFlag,
}) => {
  return (
    <button
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
      {cell.status === "FLAGGED"
        ? "🚩"
        : cell.status === "REVEALED"
        ? cell.value
        : ""}
    </button>
  );
};

export default Cell;
