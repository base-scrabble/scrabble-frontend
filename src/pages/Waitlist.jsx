import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Waitlist() {
  const [waitlistCount, setWaitlistCount] = useState(2847);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    { icon: "⚡", title: "Lightning Fast", desc: "Real-time multiplayer action" },
    { icon: "💎", title: "Earn Rewards", desc: "Win ETH and USDC prizes" },
    { icon: "🏆", title: "Tournaments", desc: "Compete in epic battles" },
    { icon: "🎨", title: "NFT Badges", desc: "Collect rare achievements" }
  ];

  useEffect(() => {
    // Add Prefinery initialization script
    const initScript = document.createElement('script');
    initScript.innerHTML = `
      prefinery = window.prefinery || function() {
        (window.prefinery.q = window.prefinery.q || []).push(arguments);
      };
    `;
    document.head.appendChild(initScript);
    
    // Load the widget script
    const widgetScript = document.createElement('script');
    widgetScript.src = 'https://widget.prefinery.com/widget/v2/httxquc8.js';
    widgetScript.defer = true;
    widgetScript.onload = () => {
      console.log('Prefinery widget script loaded');
    };
    document.head.appendChild(widgetScript);

    // Add custom styles for Prefinery widget
    const style = document.createElement('style');
    style.textContent = `
      .prefinery-widget-container input {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 16px !important;
        color: white !important;
        padding: 16px 20px !important;
        font-size: 18px !important;
        backdrop-filter: blur(10px) !important;
        transition: all 0.3s ease !important;
      }
      
      .prefinery-widget-container input:focus {
        border-color: rgba(59, 130, 246, 0.5) !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
        outline: none !important;
      }
      
      .prefinery-widget-container input::placeholder {
        color: rgba(156, 163, 175, 1) !important;
      }
      
      .prefinery-widget-container button {
        background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899) !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 16px !important;
        color: white !important;
        font-weight: 800 !important;
        font-size: 18px !important;
        padding: 16px 32px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      }
      
      .prefinery-widget-container button:hover {
        background: linear-gradient(to right, #2563eb, #7c3aed, #db2777) !important;
        transform: scale(1.05) !important;
      }
      
      .prefinery-widget-container .prefinery-form {
        background: transparent !important;
      }
      
      .prefinery-widget-container * {
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);

    // Animate counter on load
    const timer = setInterval(() => {
      setAnimatedCount(prev => {
        if (prev < waitlistCount) {
          return prev + Math.ceil((waitlistCount - prev) / 20);
        }
        clearInterval(timer);
        return waitlistCount;
      });
    }, 50);

    // Rotate features
    const featureTimer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(featureTimer);
    };
  }, [waitlistCount]);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex flex-col">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-15 animate-pulse animation-delay-4000"></div>
        
        {/* Particle Effects */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-lg sm:text-xl">S</span>
          </div>
          <div className="min-w-0">
            <div className="font-black text-lg sm:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              BaseScrabble
            </div>
            <div className="text-xs sm:text-sm text-gray-400 -mt-1 hidden sm:block">Onchain Word Gaming</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-8">
          <div className="hidden sm:flex items-center space-x-3 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30 backdrop-blur-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300 font-semibold">Live Beta</span>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-3 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/10">
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        {/* Floating Board with Advanced Effects */}
        <div className="mb-8 sm:mb-16 relative group">
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl sm:blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl sm:blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="relative transform hover:scale-105 sm:hover:scale-110 transition-transform duration-500">
            <img
              src="/scrabble-board.png"
              alt="Scrabble Preview"
              className="relative w-48 sm:w-64 md:w-80 lg:w-96 rounded-2xl sm:rounded-3xl shadow-2xl mx-auto border-2 border-white/30 backdrop-blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl sm:rounded-3xl"></div>
          </div>
          
          {/* Floating Elements - Hidden on mobile for cleaner look */}
          <div className="hidden sm:block absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce opacity-80 shadow-2xl flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="hidden sm:block absolute -bottom-6 -left-6 w-10 h-10 bg-green-400 rounded-full animate-bounce animation-delay-500 opacity-80 shadow-2xl flex items-center justify-center">
            <span className="text-xl">💎</span>
          </div>
          <div className="hidden sm:block absolute top-1/2 -right-12 w-8 h-8 bg-purple-400 rounded-full animate-pulse opacity-60 flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </div>
        </div>
        
        <div className="space-y-6 sm:space-y-12 w-full max-w-6xl mx-auto">
          {/* Enhanced Title */}
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                The Future of
              </span>
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl block mt-2 sm:mt-4">
                Word Gaming
              </span>
            </h1>
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl sm:blur-3xl -z-10"></div>
          </div>
          
          {/* Enhanced Description */}
          <div className="relative max-w-4xl mx-auto">
            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 leading-relaxed font-light px-4">
              Play competitive Scrabble on <span className="text-blue-400 font-bold">Base chain</span>. 
              <br className="hidden sm:block" />
              Stake, compete, and earn rewards in the ultimate 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold"> onchain word battle</span>.
            </p>
          </div>
          
          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-8 sm:mt-16 px-4">
            {[
              { icon: "🏆", text: "Tournament Mode", color: "from-blue-500 to-cyan-500" },
              { icon: "💰", text: "Stake & Earn", color: "from-green-500 to-emerald-500" },
              { icon: "🎯", text: "NFT Rewards", color: "from-purple-500 to-pink-500" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20 blur-lg sm:blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl sm:rounded-3xl px-4 py-2 sm:px-8 sm:py-4 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-2xl">
                  <span className="text-xl sm:text-3xl mr-2 sm:mr-3">{feature.icon}</span>
                  <span className="font-bold text-sm sm:text-xl">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8 sm:mt-16 text-sm sm:text-lg text-gray-400 px-4">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium text-xs sm:text-base">Live on Base</span>
            </div>
            <div className="w-px h-4 sm:h-6 bg-white/20 hidden md:block"></div>
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
              <span className="text-sm sm:text-xl">⚡</span>
              <span className="font-medium text-xs sm:text-base">Gas Optimized</span>
            </div>
            <div className="w-px h-4 sm:h-6 bg-white/20 hidden md:block"></div>
            <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
              <span className="text-sm sm:text-xl">🔒</span>
              <span className="font-medium text-xs sm:text-base">Fully Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Centered */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20">
        
        {/* Waitlist Form - Centered and Larger */}
        <div className="w-full lg:w-1/2 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-black/90 backdrop-blur-xl border-2 border-white/30 p-6 sm:p-12 rounded-3xl shadow-2xl">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-2xl">
                  <span className="text-2xl sm:text-3xl">🚀</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Join the Elite Waitlist
                </h2>
                <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl leading-relaxed px-2">
                  Secure your spot in the most anticipated onchain word game
                </p>
                
                {/* Live Counter - Enhanced */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl border-2 border-blue-500/20 backdrop-blur-sm">
                  <div className="text-sm sm:text-lg text-gray-400 mb-1 sm:mb-2">Players in waitlist</div>
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {animatedCount.toLocaleString()}+
                  </div>
                  <div className="flex items-center justify-center mt-2 sm:mt-4 space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-green-400 font-semibold">Growing fast</span>
                  </div>
                </div>
              </div>
            
            {/* Temporary fallback form while debugging Prefinery */}
            <form className="space-y-6 sm:space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-4 sm:px-6 sm:py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300 text-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white/20"
                  >
                    🚀 Join Waitlist
                  </button>
                  
                  {/* Prefinery Widget Container - Hidden for now */}
                  <div 
                    data-prefinery-embed="httxquc8" 
                    style={{ display: 'none' }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center text-base sm:text-lg text-gray-400">
                <p>🔒 We respect your privacy. No spam, ever.</p>
              </div>
            </form>
            </div>
          </div>
        </div>

        {/* Features & Leaderboard */}
        <div className="w-full lg:w-1/2 space-y-6">
          
          {/* Game Features */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🎮</span> Game Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-blue-400 text-2xl mb-2">⚡</div>
                <h4 className="font-semibold mb-1">Real-time Multiplayer</h4>
                <p className="text-sm text-gray-400">Compete with players worldwide</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-green-400 text-2xl mb-2">💎</div>
                <h4 className="font-semibold mb-1">Stake & Earn</h4>
                <p className="text-sm text-gray-400">Win ETH and USDC rewards</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-purple-400 text-2xl mb-2">🏆</div>
                <h4 className="font-semibold mb-1">Tournaments</h4>
                <p className="text-sm text-gray-400">Compete in scheduled events</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-pink-400 text-2xl mb-2">🎨</div>
                <h4 className="font-semibold mb-1">NFT Badges</h4>
                <p className="text-sm text-gray-400">Collect unique achievements</p>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🌟</span> Top Players Preview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="font-semibold">player.eth</span>
                </div>
                <span className="text-yellow-400 font-bold">2,847 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="font-semibold">baseMaxi</span>
                </div>
                <span className="text-gray-300 font-bold">2,156 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="font-semibold">wordlord</span>
                </div>
                <span className="text-orange-300 font-bold">1,983 pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">?</div>
                  <span className="font-semibold italic text-gray-400">Your name here</span>
                </div>
                <span className="text-purple-400 font-bold">Soon™</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-white/20 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
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
