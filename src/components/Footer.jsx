export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left side - Brand */}
          <div className="text-lg font-semibold text-white">
            Based Scrabble by <span className="text-orange-400">noblepeter2000</span>
          </div>
  
          {/* Center - Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/" className="hover:text-orange-400 transition">Home</a>
            <a href="/about" className="hover:text-orange-400 transition">About</a>
            <a href="/waitlist" className="hover:text-orange-400 transition">Waitlist</a>
            <a href="/play" className="hover:text-orange-400 transition">Play</a>
          </div>
  
          {/* Right side - Copyright */}
          <div className="mt-4 md:mt-0 text-sm text-gray-400">
            © {new Date().getFullYear()} Based Scrabble. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }