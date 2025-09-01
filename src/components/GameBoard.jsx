import Tile from "./Tile";

export default function Board() {
  const grid = Array.from({ length: 15 }, () => Array(15).fill(""));

  return (
    <div className="grid grid-cols-15 gap-1 bg-gray-200 p-2">
      {grid.map((row, i) =>
        row.map((_, j) => <Tile key={`${i}-${j}`} />)
      )}
    </div>
  );
}
