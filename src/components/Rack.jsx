import Tile from "./Tile";

export default function Rack({
  tiles = [],
  selectedIndex,
  exchangeMode = false,
  exchangeSelection = [],
  onSelectTile,
  onToggleExchangeSelection,
  disabled,
  canDrop = false,
}) {
  const handleTileClick = (idx, tile) => {
    if (disabled) return;
    if (exchangeMode) {
      if (!tile) return;
      onToggleExchangeSelection?.(idx);
      return;
    }
    if (!tile && !canDrop) return;
    onSelectTile?.(idx);
  };

  return (
    <div className="rack__wrapper" data-exchange-mode={exchangeMode || undefined}>
      {(tiles || []).map((tile, idx) => {
        const tileValue = tile?.letter || (typeof tile === "string" ? tile : null);
        const isBlank = Boolean(tile?.isBlank || tileValue === "?");
        const tileScore = typeof tile?.value === "number" ? tile.value : undefined;
        const isExchangeSelected = exchangeMode && exchangeSelection.includes(idx);
        const isSelected = exchangeMode ? isExchangeSelected : selectedIndex === idx;
        const isEmpty = !tileValue;
        const tileClass = [
          "rack__tile",
          isSelected ? "rack__tile--selected" : "",
          isExchangeSelected ? "rack__tile--exchange" : "",
          isEmpty ? "rack__tile--empty" : "",
        ]
          .join(" ")
          .trim();
        const shouldDisable =
          disabled ||
          (exchangeMode && !tileValue) ||
          (!tileValue && !canDrop);
        return (
          <Tile
            key={`${tileValue || "blank"}-${idx}-${isBlank ? "blank" : "letter"}`}
            value={tileValue}
            isBlank={isBlank}
            scoreValue={tileScore}
            onPlace={() => handleTileClick(idx, tile)}
            className={tileClass}
            disabled={shouldDisable}
          />
        );
      })}
    </div>
  );
}
