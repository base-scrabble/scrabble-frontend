import { Link } from "react-router-dom";
import { useCallback } from "react";
import { useWallet } from "../context/WalletContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { account, connect, disconnect, loading, autoConnectEnabled, toggleAutoConnect } = useWallet();

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to connect wallet");
    }
  }, [connect]);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow">
      <div className="container mx-auto flex flex-wrap gap-3 justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Based Scrabble
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/create" className="hover:underline">
            Create Game
          </Link>
          <div className="flex items-center gap-2">
            {account ? (
              <>
                <span className="font-mono text-xs bg-white/15 px-3 py-1 rounded-full border border-white/30">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="bg-white/10 border border-white/30 text-white text-xs px-3 py-1 rounded hover:bg-white/20 transition"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="bg-white text-blue-700 font-semibold text-xs px-3 py-1 rounded shadow hover:bg-blue-50 transition disabled:opacity-60"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              className="accent-blue-200"
              checked={autoConnectEnabled}
              onChange={(e) => toggleAutoConnect(e.target.checked)}
            />
            Auto-connect
          </label>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
