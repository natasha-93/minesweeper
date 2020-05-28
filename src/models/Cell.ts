export type CellCoordinates = { row: number; col: number };
export type CellStatus = "REVEALED" | "FLAGGED" | "UNREVEALED";
export type CellValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "B";

export interface ICell {
  value: CellValue;
  status: CellStatus;
}
