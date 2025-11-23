import { Link } from "react-router-dom";
import { useCallback } from 'react';
import { useWallet } from '../context/WalletContext';

export default function Home() {
  const { account, connect, disconnect, loading, autoConnectEnabled, toggleAutoConnect } = useWallet();

  const connectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Failed to connect wallet');
    }
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 space-y-10">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to BaseScrabble 🎲
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          The first onchain Scrabble game on Base — play, compete, and flex your
          word power globally!
        </p>
      </div>

      {/* Wallet Connection */}
      {!account && (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? '🔄 Connecting...' : '🔐 Connect Wallet to Play'}
        </button>
      )}

      {account && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-3 max-w-md w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-mono text-sm text-blue-700 mt-1">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              Disconnect
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600"
              checked={autoConnectEnabled}
              onChange={(e) => toggleAutoConnect(e.target.checked)}
            />
            Auto-connect this wallet on refresh
          </label>
        </div>
      )}

      {/* Call-to-Action */}
      <Link
        to="/waitlist"
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
      >
        🚀 Join the Waitlist
      </Link>

      {/* Navigation Buttons */}
      <div className="grid gap-4 w-full max-w-md">
        <Link
          to="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow text-center"
        >
          ➕ Create Game
        </Link>
        <Link
          to="/waiting"
          className="px-6 py-3 bg-yellow-600 text-white rounded-xl shadow text-center"
        >
          ⏳ Waiting Room
        </Link>
        <Link
          to="/game"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow text-center"
        >
          🎮 Play Game
        </Link>
        <Link
          to="/scoreboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow text-center"
        >
          🏆 Scoreboard
        </Link>
      </div>
    </div>
  );
}

