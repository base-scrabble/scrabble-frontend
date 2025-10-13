import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function WordValidator() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!word) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/word/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      if (!res.ok) throw new Error("Validation failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Validation error:", err);
      setResult({ valid: false, message: "Error validating word" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-sm mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Word Validator</h2>
      <input
        type="text"
        placeholder="Enter a word"
        className="w-full border rounded p-2 mb-2"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button
        onClick={handleValidate}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Checking..." : "Validate"}
      </button>
      {result && (
        <div className="mt-2 text-sm">
          {result.valid ? (
            <span className="text-green-600">✅ {word} is valid!</span>
          ) : (
            <span className="text-red-600">❌ {result.message || "Invalid word"}</span>
          )}
        </div>
      )}
    </div>
  );
}
