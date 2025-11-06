import { calculateScrabbleScore } from "../utils/scoreCalculator";

export default function Tile({ value, onPlace, className }) {
  const score = value ? calculateScrabbleScore(value) : 0;

  return (
    <div
      className={`${className} ${value ? "bg-blue-100" : "bg-white"} cursor-pointer`}
      onClick={onPlace}
    >
      {value || ""}
      {value && <span className="text-xs">({score})</span>}
    </div>
  );
}