import { Link } from "react-router-dom"
import ChatWidget from "./ChatWidget"

const Footer = () => {
  return (
    <footer className="h-full bg-gray-800 text-white relative">
      {/* Main footer container with proper spacing */}
      <div className="h-full flex items-center justify-between px-8">
        {/* Contact Section */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Contact us:</span>
          <a 
            href="mailto:PawKeeper@FakeEmail.com" 
            className="hover:text-gray-300"
            >
            ✉️ PawKeeper@FakeEmail.com
          </a>
          <a 
            href="tel:00000000" 
            className="hover:text-gray-300"
            >
            📞 00000000
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          Copyright © 2025 PawKeeper
        </p>
      </div>
    </footer>
  )
}

export default Footer