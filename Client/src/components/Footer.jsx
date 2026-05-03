import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-32">
        {/* --- Bottom Bar Section --- */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left Side: Copyright */}
            <p className="text-[10px] text-gray-400 uppercase tracking-[2px] font-black text-center md:text-left">
              © {new Date().getFullYear()} RUDRA DRIVE PREMIUM. ALL RIGHTS RESERVED.
            </p>

            {/* Right Side: Links in Single Line */}
            <div className="flex items-center gap-4 md:gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900 transition-colors duration-300">Privacy</a>
              
              {/* Separator Dot */}
              <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
              
              <a href="#" className="hover:text-slate-900 transition-colors duration-300">Terms</a>
              
              {/* Separator Dot */}
              <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
              
              <a href="#" className="hover:text-slate-900 transition-colors duration-300">Cookies</a>
            </div>

          </div>
        </div>
    </footer>
  )
}

export default Footer