export type CellStatus = "REVEALED" | "FLAGGED" | "UNREVEALED";

export interface ICell {
  value: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "B";
  status: CellStatus;
}
