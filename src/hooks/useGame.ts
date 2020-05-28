import { useReducer, useEffect } from "react";
import {
  createBoard,
  countCells,
  revealNeighbors,
  updateCell,
} from "../utils/board";
import { GameStatus } from "../models/GameStatus";
import { BoardType } from "../models/Board";

type GameState = {
  board: BoardType;
  size: number;
  bombCount: number;
  gameStatus: GameStatus;
  preRevealing: boolean;
};

type CellCoordinates = { row: number; col: number };

type GameAction =
  | { type: "REVEAL"; payload: CellCoordinates }
  | { type: "TOGGLE_FLAG"; payload: CellCoordinates }
  | { type: "RESET"; payload?: { size?: number; bombCount?: number } }
  | { type: "PRE_REVEAL" };

type HookOptions = {
  defaultSize?: number;
  defaultBombCount?: number;
};

const appReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "RESET": {
      const size = action?.payload?.size ?? state.size;
      const bombCount = action?.payload?.bombCount ?? state.bombCount;

      return {
        board: createBoard(size, bombCount),
        size,
        bombCount,
        gameStatus: "ACTIVE",
        preRevealing: false,
      };
    }
    case "TOGGLE_FLAG": {
      const { row, col } = action.payload;

      const board = updateCell(state.board, row, col, (cell) => ({
        ...cell,
        status: cell.status === "FLAGGED" ? "UNREVEALED" : "FLAGGED",
      }));

      return {
        ...state,
        board,
      };
    }
    case "PRE_REVEAL": {
      return {
        ...state,
        preRevealing: true,
      };
    }

    case "REVEAL": {
      const { row, col } = action.payload;

      const board = revealNeighbors(state.board, row, col);

      const revealedBombCount = countCells(
        board,
        (cell) => cell.value === "B" && cell.status === "REVEALED"
      );
      const revealedCount = countCells(
        board,
        (cell) => cell.status === "REVEALED"
      );
      const boardSize = state.size * state.size;

      let gameStatus = state.gameStatus;

      // Check if we've won/lost
      if (revealedBombCount > 0) {
        gameStatus = "LOST";
      } else if (boardSize - revealedCount === state.bombCount) {
        gameStatus = "WON";
      }

      return {
        ...state,
        gameStatus,
        board,
        preRevealing: false,
      };
    }
    default: {
      throw new Error(`Invalid action`);
    }
  }
};

const useGame = (
  options?: HookOptions
): [
  {
    board: BoardType;
    size: number;
    bombCount: number;
    gameStatus: GameStatus;
    flaggedCount: number;
    preRevealing: boolean;
  },
  React.Dispatch<GameAction>
] => {
  const defaultSize = options?.defaultSize ?? 10;
  const defaultBombCount = options?.defaultBombCount ?? 10;

  const [
    { board, size, bombCount, gameStatus, preRevealing },
    dispatch,
  ] = useReducer(appReducer, {
    gameStatus: "ACTIVE",
    size: defaultSize,
    bombCount: defaultBombCount,
    board: createBoard(defaultSize, defaultBombCount),
    preRevealing: false,
  });

  const flaggedCount = countCells(board, (cell) => cell.status === "FLAGGED");

  // useEffect(() => {
  //   if (gameStatus === "ACTIVE") return;

  //   if (gameStatus === "WON") {
  //     alert("You won!");
  //   } else if (gameStatus === "LOST") {
  //     alert("You lost!");
  //   }
  // }, [gameStatus]);

  return [
    {
      flaggedCount,
      board,
      size,
      bombCount,
      gameStatus,
      preRevealing,
    },
    dispatch,
  ];
};

export default useGame;
