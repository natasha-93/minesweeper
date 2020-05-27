import * as React from "react";
import { CellValue } from "./models/Cell";

export interface CellIconProps {
  visible: boolean;
  flagged: boolean;
  value: CellValue;
}

const CellIcon: React.SFC<CellIconProps> = ({ visible, value, flagged }) => {
  if (flagged) return <>🚩</>;
  if (!visible) return null;
  if (value === "B") return <>💣</>;
  if (value === "0") return null;

  return <>{value}</>;
};

export default CellIcon;
