import Tile from "./Tile";

export default function Rack({ tiles }) {
  return (
    <div className="flex gap-2 p-2 bg-gray-200 rounded-lg">
      {tiles.map((t, i) => <Tile key={i} letter={t} />)}
    </div>
  );
}