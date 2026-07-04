"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CellType = "empty" | "chip" | "block";

interface FallingCell {
  col: number;
  row: number;
  type: Exclude<CellType, "empty">;
}

const COLS = 7;
const ROWS = 9;
const START_COL = Math.floor(COLS / 2);
const TICK_MS = 420;

function createFallingCell(): FallingCell {
  return {
    col: Math.floor(Math.random() * COLS),
    row: 0,
    type: Math.random() > 0.72 ? "chip" : "block",
  };
}

export default function OSRetroGame() {
  const [playerCol, setPlayerCol] = useState(START_COL);
  const [cells, setCells] = useState<FallingCell[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const playerColRef = useRef(playerCol);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    playerColRef.current = playerCol;
  }, [playerCol]);

  const playSound = useCallback((type: "move" | "chip" | "crash" | "start") => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;

    if (context.state === "suspended") {
      context.resume().catch(() => undefined);
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const soundMap = {
      move: { frequency: 220, duration: 0.05, volume: 0.025 },
      chip: { frequency: 660, duration: 0.09, volume: 0.04 },
      crash: { frequency: 90, duration: 0.18, volume: 0.055 },
      start: { frequency: 440, duration: 0.08, volume: 0.035 },
    };
    const sound = soundMap[type];

    oscillator.type = type === "crash" ? "sawtooth" : "square";
    oscillator.frequency.setValueAtTime(sound.frequency, now);
    gain.gain.setValueAtTime(sound.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + sound.duration);
  }, []);

  const resetGame = useCallback(() => {
    playSound("start");
    setPlayerCol(START_COL);
    setCells([]);
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    setIsRunning(true);
  }, [playSound]);

  const movePlayer = useCallback(
    (direction: -1 | 1) => {
      if (!isStarted || isGameOver) {
        return;
      }

      playSound("move");
      setPlayerCol((current) =>
        Math.max(0, Math.min(COLS - 1, current + direction)),
      );
    },
    [isGameOver, isStarted, playSound],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        movePlayer(-1);
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        movePlayer(1);
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!isStarted || isGameOver) {
          resetGame();
        } else {
          setIsRunning((current) => !current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, isStarted, movePlayer, resetGame]);

  useEffect(() => {
    if (!isStarted || !isRunning || isGameOver) {
      return;
    }

    const timer = window.setInterval(() => {
      setCells((currentCells) => {
        const nextCells: FallingCell[] = [];
        let scoreGain = 1;
        let didCrash = false;

        currentCells.forEach((cell) => {
          const nextRow = cell.row + 1;

          if (nextRow >= ROWS - 1 && cell.col === playerColRef.current) {
            if (cell.type === "chip") {
              scoreGain += 8;
              playSound("chip");
              return;
            }

            didCrash = true;
            playSound("crash");
            return;
          }

          if (nextRow < ROWS) {
            nextCells.push({ ...cell, row: nextRow });
          }
        });

        if (didCrash) {
          setIsGameOver(true);
          setIsRunning(false);
          setBestScore((currentBest) => Math.max(currentBest, score));
          return currentCells;
        }

        if (Math.random() > 0.34) {
          nextCells.push(createFallingCell());
        }

        setScore((currentScore) => {
          const nextScore = currentScore + scoreGain;
          setBestScore((currentBest) => Math.max(currentBest, nextScore));
          return nextScore;
        });

        return nextCells;
      });
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [isStarted, isRunning, isGameOver, score, playSound]);

  const grid = useMemo(() => {
    return Array.from({ length: ROWS }, (_, row) =>
      Array.from({ length: COLS }, (_, col) => {
        if (row === ROWS - 1 && col === playerCol) {
          return "player";
        }

        return (
          cells.find((cell) => cell.row === row && cell.col === col)?.type ??
          "empty"
        );
      }),
    );
  }, [cells, playerCol]);

  return (
    <section className="flex h-full min-h-0 items-center justify-center bg-slate-950 p-1.5 text-slate-100">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-col rounded-md border border-slate-700 bg-slate-900 p-3 shadow-inner">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-mono text-base font-bold text-emerald-300">
              Byte Run
            </h2>
            <p className="font-mono text-[11px] text-slate-400">
              Green good. Red bad.
            </p>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-300">
            <p>Score {score}</p>
            <p>Best {bestScore}</p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col gap-2.5">
          {!isStarted && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md border border-emerald-400/30 bg-slate-950/95 p-4 text-center shadow-inner">
              <div className="max-w-[320px]">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300">
                  Ready player
                </p>
                <h3 className="mt-2 font-mono text-3xl font-black text-white">
                  BYTE RUN
                </h3>
                <p className="mt-3 font-mono text-[11px] leading-5 text-slate-300">
                  Catch green chips, dodge red blocks. Use A/D or arrow keys.
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-5 h-10 rounded-md bg-emerald-400 px-5 font-mono text-xs font-bold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                >
                  Start Game
                </button>
                <p className="mt-3 font-mono text-[10px] text-slate-500">
                  Press Enter or Space
                </p>
              </div>
            </div>
          )}

          <div
            className="grid gap-1 rounded-md border border-slate-700 bg-slate-950 p-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            aria-label="Byte Run game board"
          >
            {grid.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <span
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square rounded-sm border ${
                    cell === "player"
                      ? "border-cyan-200 bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.55)]"
                      : cell === "chip"
                        ? "border-emerald-200 bg-emerald-400"
                        : cell === "block"
                          ? "border-red-300 bg-red-500"
                          : "border-slate-800 bg-slate-900"
                  }`}
                />
              )),
            )}
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => movePlayer(-1)}
                className="h-9 w-14 rounded-md border border-slate-700 bg-slate-800 font-mono text-[11px] font-bold text-slate-100 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => movePlayer(1)}
                className="h-9 w-14 rounded-md border border-slate-700 bg-slate-800 font-mono text-[11px] font-bold text-slate-100 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Right
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isGameOver) {
                    resetGame();
                  } else {
                    setIsRunning((current) => !current);
                    playSound("start");
                  }
                }}
                className="h-9 rounded-md bg-emerald-400 px-3 font-mono text-[11px] font-bold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                {isGameOver ? "Restart" : isRunning ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={resetGame}
                className="h-9 rounded-md border border-slate-700 bg-slate-800 px-3 font-mono text-[11px] font-bold text-slate-100 transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Reset
              </button>
            </div>
          </div>

          {isGameOver && (
            <div className="rounded-md border border-red-500/50 bg-red-950/60 px-2.5 py-1.5 font-mono text-[11px] text-red-100">
              System crash. Press Restart.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
