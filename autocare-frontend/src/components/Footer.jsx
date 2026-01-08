import React from "react";
export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-white text-lg font-bold mb-2">AutoCare</h3>
          <p className="text-sm">
            Never miss your vehicle service again.  
            Simple, reliable, and efficient.
          </p>
        </div>

        {/* About */}
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Our Story</li>
            <li className="hover:text-white cursor-pointer">Team</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>adminautocare@gmail.com</li>
            <li>+91 9567290880</li>
            <li>Calicut</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center text-sm py-4">
        © {new Date().getFullYear()} AutoCare. All rights reserved.
      </div>
    </footer>
  );
}
