import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: ['text-blue-400', 'text-purple-400', 'text-pink-400', 'text-green-400', 'text-yellow-400'][Math.floor(Math.random() * 5)]
    }));
    setConfettiPieces(pieces);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Success Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Confetti Animation */}
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className={`absolute w-3 h-3 ${piece.color} opacity-80 animate-bounce`}
            style={{
              left: `${piece.left}%`,
              top: '-10px',
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              transform: 'rotate(45deg)'
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <div>
            <div className="font-black text-2xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              BaseScrabble
            </div>
            <div className="text-sm text-gray-400 -mt-1">Success!</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30 backdrop-blur-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300 font-semibold">Registered</span>
          </div>
        </div>
      </nav>

      {/* Main Success Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 py-20 text-center">
        
        {/* Success Animation */}
        <div className="mb-16 relative group">
          <div className="absolute -inset-8 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl animate-bounce">🎉</span>
          </div>
          
          {/* Floating Success Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce opacity-80 shadow-2xl flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-green-400 rounded-full animate-bounce animation-delay-500 opacity-80 shadow-2xl flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-8 max-w-4xl mx-auto mb-16">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent block">
              Welcome
            </span>
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent block mt-4">
              Aboard!
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
            You're officially part of the <span className="text-green-400 font-bold">BaseScrabble</span> elite waitlist.
            <br className="hidden md:block" />
            Get ready for the ultimate <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">onchain word gaming</span> experience!
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mb-16">
          
          {/* Community Card */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl border-2 border-white/30 p-8 rounded-3xl shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Join the Community
                </h3>
                <p className="text-gray-400 text-lg">
                  Connect with fellow players and get exclusive updates
                </p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="https://t.me/+_u8MjvBypj0yNzM8"
                  target="_blank"
                  rel="noopener"
                  className="block w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  📱 Join Telegram
                </a>
                <a
                  href="https://discord.gg/2jexYPVA"
                  target="_blank"
                  rel="noopener"
                  className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  💬 Join Discord
                </a>
              </div>
            </div>
          </div>

          {/* Share Card */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl border-2 border-white/30 p-8 rounded-3xl shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-3xl">📢</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Spread the Word
                </h3>
                <p className="text-gray-400 text-lg">
                  Share with friends and earn bonus rewards
                </p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="https://x.com/intent/tweet?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20%F0%9F%8E%B2%20Join%20me%20at%20https://basescrabble.vercel.app"
                  target="_blank"
                  rel="noopener"
                  className="block w-full py-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
                >
                  𝕏 Share on X
                </a>
                <a
                  href="https://warpcast.com/~/compose?text=I%20just%20joined%20the%20BaseScrabble%20waitlist!%20%F0%9F%8E%B2%20Join%20me%20at%20https://basescrabble.vercel.app"
                  target="_blank"
                  rel="noopener"
                  className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🟣 Share on Farcaster
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-black/80 backdrop-blur-xl border-2 border-white/20 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🎯 What's Next?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl mb-3">📧</div>
                  <h4 className="font-bold text-lg mb-2 text-green-400">Email Updates</h4>
                  <p className="text-gray-400 text-sm">Get notified about launch dates and exclusive access</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-bold text-lg mb-2 text-blue-400">Early Access</h4>
                  <p className="text-gray-400 text-sm">Play before public launch and earn founder rewards</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl mb-3">💎</div>
                  <h4 className="font-bold text-lg mb-2 text-purple-400">Exclusive NFTs</h4>
                  <p className="text-gray-400 text-sm">Receive limited edition founder badges and rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="relative group bg-white/10 backdrop-blur-lg border-2 border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:bg-white/20"
        >
          <span className="mr-2">⬅</span>
          Back to Waitlist
        </button>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/20 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-xl">BaseScrabble</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a 
                href="https://x.com/basescrabble" 
                target="_blank" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="text-xl">𝕏</span>
                <span>Twitter</span>
              </a>
              <a 
                href="https://t.me/+_u8MjvBypj0yNzM8" 
                target="_blank" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="text-xl">📱</span>
                <span>Telegram</span>
              </a>
              <a 
                href="https://discord.gg/2jexYPVA" 
                target="_blank" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="text-xl">💬</span>
                <span>Discord</span>
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>© 2024 BaseScrabble. Built on Base chain with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}