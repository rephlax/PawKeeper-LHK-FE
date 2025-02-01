import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="h-full text-cream-text relative">
      {/* Main footer container */}
      <div className="h-full flex items-center justify-between px-8">
        {/* Contact Section */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Contact us:</span>
          <a 
            href="mailto:PawKeeper@FakeEmail.com" 
            className="hover:text-cream-800"
            >
            ✉️ PawKeeper@FakeEmail.com
          </a>
          <a 
            href="tel:00000000" 
            className="hover:text-cream-800"
            >
            📞 00000000
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-cream-800">
          Copyright © 2025 PawKeeper
        </p>
      </div>
    </footer>
  )
}

export default Footer