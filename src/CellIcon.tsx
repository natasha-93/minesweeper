import * as React from "react";
import { CellValue } from "./models/Cell";

export interface CellIconProps {
  visible: boolean;
  flagged: boolean;
  value: CellValue;
}

const valueColorMap: Record<string, string> = {
  "1": "blue",
  "2": "green",
  "3": "red",
  "4": "purple",
  "5": "maroon",
  "6": "turquoise",
  "7": "black",
  "8": "gray",
};

const CellIcon: React.SFC<CellIconProps> = ({ visible, value, flagged }) => {
  if (flagged) return <>🚩</>;
  if (!visible) return null;
  if (value === "B") return <>💣</>;
  if (value === "0") return null;

  return <span style={{ color: valueColorMap[value] }}>{value}</span>;
};

export default CellIcon;
