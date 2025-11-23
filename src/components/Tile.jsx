import { calculateScrabbleScore } from "../utils/scoreCalculator";

export default function Tile({ value, onPlace, className, disabled, isBlank, scoreValue }) {
  const displayLetter = value || "_";
  const derivedScore = typeof scoreValue === "number" ? scoreValue : value ? calculateScrabbleScore(value) : 0;
  const score = isBlank ? 0 : derivedScore;
  const isDisabled = typeof disabled === "boolean" ? disabled : !value;

  return (
    <button
      type="button"
      className={`tile ${className || ""}`.trim()}
      onClick={onPlace}
      disabled={isDisabled}
      data-empty={!value || undefined}
      data-blank={isBlank || undefined}
    >
      <span className={`tile__letter ${!value ? "tile__letter--placeholder" : ""}`}>
        {displayLetter}
      </span>
      {value && !isBlank && <span className="tile__score">{score}</span>}
    </button>
  );
}