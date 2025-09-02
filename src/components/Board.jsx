export default function Board({ board, setBoard }) {
  return (
    <div className="grid grid-cols-15 gap-1 bg-green-200 p-2 rounded-lg">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div 
            key={`${i}-${j}`}
            className="w-8 h-8 flex items-center justify-center border bg-white"
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}