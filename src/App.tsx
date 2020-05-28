import React from "react";
import Board from "./Board";
import useGame from "./hooks/useGame";
import styles from "./App.module.css";

function App() {
  const [
    { flaggedCount, board, size, bombCount, gameStatus, preRevealing },
    dispatch,
  ] = useGame({ defaultSize: 10, defaultBombCount: 10 });

  return (
    <div className={styles.app}>
      <h2>Minesweeper</h2>

      <div className={styles.gameSliders}>
        <div className={styles.sliderContainer}>
          <label>Size</label>
          <input
            className={styles.slider}
            min={3}
            max={20}
            step={1}
            type="range"
            value={size}
            onChange={(e) => {
              const prevBombSizeRatio = bombCount / (size * size);
              const newSize = Number(e.target.value);
              const desiredBombCount = Math.round(
                prevBombSizeRatio * newSize * newSize
              );
              const maxBombCount = newSize * newSize - 1;

              dispatch({
                type: "RESET",
                payload: {
                  size: newSize,
                  bombCount: Math.min(desiredBombCount, maxBombCount),
                },
              });
            }}
          />
        </div>

        <div className={styles.sliderContainer}>
          <label>Bombs</label>
          <input
            className={styles.slider}
            min={1}
            max={size * size - 1}
            step={1}
            type="range"
            value={bombCount}
            onChange={(e) => {
              dispatch({
                type: "RESET",
                payload: {
                  bombCount: Number(e.target.value),
                },
              });
            }}
          />
        </div>
      </div>

      <div className={styles.gameInfo}>
        <p className={styles.bombCounter}>
          Bombs left: {bombCount - flaggedCount}
        </p>
        <button
          className={styles.resetButton}
          onClick={(e) => dispatch({ type: "RESET" })}
        >
          {preRevealing
            ? "😮"
            : gameStatus === "ACTIVE"
            ? "🙂"
            : gameStatus === "WON"
            ? "😎"
            : "😵"}
        </button>
      </div>

      <Board
        board={board}
        gameStatus={gameStatus}
        onReveal={(row, col) =>
          dispatch({ type: "REVEAL", payload: { row, col } })
        }
        onToggleFlag={(row, col) =>
          dispatch({ type: "TOGGLE_FLAG", payload: { row, col } })
        }
        onPreReveal={() => dispatch({ type: "PRE_REVEAL" })}
      />
    </div>
  );
}

export default App;
