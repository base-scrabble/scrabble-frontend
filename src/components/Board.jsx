import { useMemo } from "react";

const BOARD_SIZE = 15;
const DEFAULT_BOARD = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
const PREMIUM_SQUARES = {
  "0,0": "TW", "0,7": "TW", "0,14": "TW",
  "7,0": "TW", "7,14": "TW",
  "14,0": "TW", "14,7": "TW", "14,14": "TW",
  "1,1": "DW", "2,2": "DW", "3,3": "DW", "4,4": "DW",
  "10,10": "DW", "11,11": "DW", "12,12": "DW", "13,13": "DW",
  "1,13": "DW", "2,12": "DW", "3,11": "DW", "4,10": "DW",
  "10,4": "DW", "11,3": "DW", "12,2": "DW", "13,1": "DW",
  "5,1": "TL", "9,1": "TL", "1,5": "TL", "5,5": "TL", "9,5": "TL", "13,5": "TL",
  "1,9": "TL", "5,9": "TL", "9,9": "TL", "13,9": "TL", "5,13": "TL", "9,13": "TL",
  "0,3": "DL", "0,11": "DL", "2,6": "DL", "2,8": "DL", "3,0": "DL", "3,7": "DL", "3,14": "DL",
  "6,2": "DL", "6,6": "DL", "6,8": "DL", "6,12": "DL",
  "7,3": "DL", "7,11": "DL",
  "8,2": "DL", "8,6": "DL", "8,8": "DL", "8,12": "DL",
  "11,0": "DL", "11,7": "DL", "11,14": "DL", "12,6": "DL", "12,8": "DL", "14,3": "DL", "14,11": "DL"
};

const premiumStyles = {
  TW: { className: "premium premium--tw", label: "TW" },
  DW: { className: "premium premium--dw", label: "DW" },
  TL: { className: "premium premium--tl", label: "TL" },
  DL: { className: "premium premium--dl", label: "DL" },
};

export default function Board({ board, onTilePlace, pendingPlacements = [] }) {
  const boardGrid = useMemo(() => {
    if (Array.isArray(board) && board.length === BOARD_SIZE) {
      return board.map((row) =>
        Array.isArray(row) && row.length === BOARD_SIZE ? row : Array(BOARD_SIZE).fill(null)
      );
    }
    return DEFAULT_BOARD;
  }, [board]);

  const pendingMap = useMemo(() => {
    const map = new Map();
    (pendingPlacements || []).forEach((placement) => {
      if (placement && typeof placement.row === 'number') {
        map.set(`${placement.row},${placement.col}`, {
          letter: placement.letter,
          isBlank: Boolean(placement.isBlank),
        });
      }
    });
    return map;
  }, [pendingPlacements]);

  return (
    <div className="scrabble-board__wrapper">
      <div
        className="scrabble-board"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
      >
        {boardGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const key = `${rIdx},${cIdx}`;
            const premium = PREMIUM_SQUARES[key];
            const style = premiumStyles[premium];
            const pendingEntry = pendingMap.get(key);
            const pendingLetter = pendingEntry?.letter;
            const pendingBlank = pendingEntry?.isBlank;
            const cellData = cell && typeof cell === 'object'
              ? cell
              : { letter: cell, isBlank: false };
            const displayLetter = pendingLetter || cellData.letter;
            const isBlankTile = pendingBlank || cellData.isBlank;

            const baseClass = cell
              ? "scrabble-board__cell scrabble-board__cell--filled"
              : "scrabble-board__cell";

            const premiumClass = style?.className ? ` ${style.className}` : "";
            const pendingClass = pendingLetter ? " scrabble-board__cell--pending" : "";

            return (
              <div
                key={key}
                onClick={() => onTilePlace?.(rIdx, cIdx)}
                className={`${baseClass}${premiumClass}${pendingClass}`}
                data-premium={premium || undefined}
                data-filled={!!displayLetter || undefined}
                data-pending={pendingLetter || undefined}
                data-blank={isBlankTile || undefined}
              >
                <span className="scrabble-board__cell-label">
                  {displayLetter || style?.label || ""}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
