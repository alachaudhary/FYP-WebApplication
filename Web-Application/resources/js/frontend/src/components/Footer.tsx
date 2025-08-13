import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About FauxShield</h3>
            <p className="text-gray-400">
              FauxShield is dedicated to providing advanced deepfake detection solutions.
              Our mission is to ensure digital authenticity and safeguard online integrity.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-white">Education</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://linkedin.com/in/abd-ul-ala-taha-960985220" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
              </a>
              <a href="mailto:contact@fauxshield.com"
                 className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 FauxShield. All rights reserved.</p>
            <p className="text-gray-400">
              Contact us: <a href="mailto:contact@fauxshield.com" className="hover:text-white">contact@fauxshield.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;