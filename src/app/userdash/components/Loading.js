import React from 'react'

const Loading = () => {
  return (
    <div>
      
      <div className="min-h-screen bg-gradient-to-r from-white to-gray-100 flex items-center justify-center p-6">
      {/* Main container for the loader */}
      <div className="relative flex items-center justify-center">
        {/* Central spinning ring */}
        <div className="w-20 h-20 border-4 border-t-transparent border-yellow-600 rounded-full animate-spin"></div>
        
        {/* Orbiting dots */}
        <div className="absolute w-28 h-28 animate-pulse">
          <div className="absolute w-4 h-4 bg-yellow-600 rounded-full top-0 left-1/2 -translate-x-1/2 animate-orbit"></div>
          <div className="absolute w-4 h-4 bg-yellow-600 rounded-full bottom-0 left-1/2 -translate-x-1/2 animate-orbit-delayed"></div>
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute w-24 h-24 bg-yellow-200 rounded-full opacity-50 animate-ping"></div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes orbit-delayed {
          0% { transform: rotate(180deg) translateX(40px) rotate(180deg); }
          100% { transform: rotate(540deg) translateX(40px) rotate(-180deg); }
        }
        .animate-orbit {
          animation: orbit 3s linear infinite;
        }
        .animate-orbit-delayed {
          animation: orbit-delayed 3s linear infinite;
        }
      `}</style>
    </div>
    </div>
  )
}

export default Loading
