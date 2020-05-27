import React from "react";
import Board from "./Board";
import useGame from "./hooks/useGame";

function App() {
  const [
    { flaggedCount, board, size, bombCount, gameStatus },
    dispatch,
  ] = useGame({ defaultSize: 10, defaultBombCount: 10 });

  return (
    <div>
      <h2>Minesweeper</h2>

      <div>
        <label>Size</label>
        <input
          min={3}
          max={20}
          step={1}
          type="range"
          value={size}
          onChange={(e) => {
            dispatch({
              type: "RESET",
              payload: {
                size: Number(e.target.value),
                bombCount: Number(e.target.value),
              },
            });
          }}
        />
      </div>

      <p>Bombs left: {bombCount - flaggedCount}</p>

      <Board
        board={board}
        gameStatus={gameStatus}
        onReveal={(row, col) =>
          dispatch({ type: "REVEAL", payload: { row, col } })
        }
        onToggleFlag={(row, col) =>
          dispatch({ type: "TOGGLE_FLAG", payload: { row, col } })
        }
      />

      <button onClick={(e) => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}

export default App;
