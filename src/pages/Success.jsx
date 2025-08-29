import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4">
      {/* Board Image */}
      <div className="w-full flex justify-center mb-6">
        <img
          src="/board.png"
          alt="Scrabble Preview"
          className="w-[280px] sm:w-[350px] md:w-[400px] lg:w-[480px] max-w-full h-auto object-contain"
        />
      </div>

      {/* Success Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          🎉 You’re on the Waitlist!
        </h1>
        <p className="text-gray-600 mb-6">
          Thanks for joining BaseScrabble.  
          Stay tuned for early access invites and leaderboards.
        </p>

        {/* Share + Join */}
        <div className="flex flex-col gap-3">
          <a
            href="https://t.me/+_u8MjvBypj0yNzM8"
            target="_blank"
            rel="noopener"
            className="bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Join Telegram
          </a>
          <a
            href="https://discord.gg/2jexYPVA"
            target="_blank"
            rel="noopener"
            className="bg-indigo-500 text-white py-3 rounded-xl hover:bg-indigo-600 transition"
          >
            Join Discord
          </a>
          <a
            href="https://x.com/intent/tweet?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20%F0%9F%8E%B2%20Join%20me%20at%20https://basescrabble.vercel.app"
            target="_blank"
            rel="noopener"
            className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Share on X
          </a>
          <a
            href="https://warpcast.com/~/compose?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20%F0%9F%8E%B2%20Join%20me%20at%20https://basescrabble.vercel.app"
            target="_blank"
            rel="noopener"
            className="bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
          >
            Share on Farcaster
          </a>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 text-sm text-gray-600 hover:text-green-600"
        >
          ⬅ Back to Waitlist
        </button>
      </div>
    </div>
  );
}