import React from "react";
import { ICell } from "./models/Cell";
import { GameStatus } from "./models/GameStatus";
import CellIcon from "./CellIcon";
import styles from "./Cell.module.css";

export type CellProps = {
  cell: ICell;
  rowIndex: number;
  colIndex: number;
  gameStatus: GameStatus;
  onReveal: (rowIndex: number, colIndex: number, cell: ICell) => void;
  onToggleFlag: (rowIndex: number, colIndex: number, cell: ICell) => void;
  onPreReveal: () => void;
};

const Cell: React.FC<CellProps> = ({
  cell,
  rowIndex,
  colIndex,
  gameStatus,
  onReveal,
  onToggleFlag,
  onPreReveal,
}) => {
  return (
    <button
      className={styles.cell}
      disabled={cell.status === "REVEALED" || gameStatus !== "ACTIVE"}
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
      onMouseDown={(e) => {
        onPreReveal();
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
