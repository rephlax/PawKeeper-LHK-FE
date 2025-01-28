import { Link } from "react-router-dom";
import ChatWidget from "./ChatWidget";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact area */}
          <section className="space-y-4">
            <h4 className="text-lg font-semibold">Contact us</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:PawKeeper@FakeEmail.com" className="hover:text-gray-300">
                  PawKeeper@FakeEmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:00000000" className="hover:text-gray-300">
                  00000000
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Copyright area */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
          <span>Copyright © 2025 PawKeeper</span>
        </div>
      </div>

      {/* Chat area */}
      <ChatWidget />
    </footer>
  );
};

export default Footer;