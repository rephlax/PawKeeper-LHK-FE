import { Link } from "react-router-dom"
import ChatWidget from "./ChatWidget"

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white p-4">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Contact section */}
        <h4 className="font-bold mb-2">Contact us</h4>
        
        {/* Email link */}
        <a 
          href="mailto:PawKeeper@FakeEmail.com" 
          className="hover:text-gray-300 mb-2"
        >
          ✉️ PawKeeper@FakeEmail.com
        </a>
        
        {/* Phone link */}
        <a 
          href="tel:00000000" 
          className="hover:text-gray-300 mb-4"
        >
          📞 00000000
        </a>
        
        {/* Copyright */}
        <p className="text-sm">
          Copyright © 2025 PawKeeper
        </p>
        
        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </footer>
  )
}

export default Footer