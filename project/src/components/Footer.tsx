import React from 'react';
import { Facebook, Instagram, Mail, Phone, PawPrint } from 'lucide-react';

export default function Footer() {
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'admin';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6" />
              <h3 className="text-xl font-bold">PawsConnect</h3>
            </div>
            <p className="text-gray-400">
              Connecting pets with loving homes since 2024.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {!isAdmin && <li><a href="/adopt" className="text-gray-400 hover:text-white">Adopt</a></li>}
              <li><a href="/lost-found" className="text-gray-400 hover:text-white">Lost & Found</a></li>
              <li><a href="/pawmart" className="text-gray-400 hover:text-white">PawMart</a></li>
              <li><a href="/community" className="text-gray-400 hover:text-white">Community</a></li>
              {!isAdmin && (
                <>
                  <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <Phone size={16} />
                (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                contact@pawsconnect.com
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 PawsConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}