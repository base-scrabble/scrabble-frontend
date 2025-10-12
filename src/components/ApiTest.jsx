import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function ApiTest() {
  const [pong, setPong] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ping`);
      if (!res.ok) throw new Error("Ping failed");
      const data = await res.text();
      setPong(data);
    } catch (err) {
      console.error("Ping error:", err);
      setPong("❌ Error pinging backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-sm mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">API Test</h2>
      <button
        onClick={handlePing}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Pinging..." : "Ping Backend"}
      </button>
      {pong && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Response:</strong> {pong}
        </div>
      )}
    </div>
  );
}
