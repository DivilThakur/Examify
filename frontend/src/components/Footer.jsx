import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Examify</h3>
            <p className="text-secondary-400">
              A modern platform for conducting and taking online examinations.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-secondary-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/dashboard" className="text-secondary-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/results" className="text-secondary-400 hover:text-white transition-colors">Results</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-secondary-400">Email: support@examify.com</li>
              <li className="text-secondary-400">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
          <p>&copy; {new Date().getFullYear()} Examify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
