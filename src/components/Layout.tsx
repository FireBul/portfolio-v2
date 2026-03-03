import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../constants';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col selection:bg-white selection:text-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-mono font-bold text-lg tracking-tighter">
            CHOI_WONHYUK
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://github.com/FireBul" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-20">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-mono text-sm text-zinc-500">© 2025 최원혁. All rights reserved.</span>
            <a href="mailto:jarelrs@gmail.com" className="text-zinc-400 hover:text-white text-sm flex items-center gap-2 justify-center md:justify-start transition-colors">
              <Mail className="w-4 h-4" /> jarelrs@gmail.com
            </a>
          </div>
          <div className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm text-zinc-500 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
