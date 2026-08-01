import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Music, Share2, Settings, Copy, Check, Sparkles, Menu, X, Play, Pause } from 'lucide-react';
import { useSiteData } from './SiteDataProvider';
import { playClickSound } from '../lib/sounds';
import { generateShareUrl } from '../lib/shareUtils';

export function Navbar() {
  const { data } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharedPage, setIsSharedPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Detect shared view vs edit mode
    if (typeof window !== 'undefined') {
      const isPreDomain = window.location.hostname.includes('ais-pre');
      const isViewMode = window.location.search.includes('view=') || window.location.search.includes('mode=view') || window.location.search.includes('cfg=');
      const hasEditParam = window.location.search.includes('edit=true') || window.location.hash === '#edit';
      setIsSharedPage((isPreDomain || isViewMode) && !hasEditParam);
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleToggle = () => setIsPlaying(p => !p);

    window.addEventListener('play-music', handlePlay);
    window.addEventListener('pause-music', handlePause);
    window.addEventListener('toggle-music', handleToggle);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('play-music', handlePlay);
      window.removeEventListener('pause-music', handlePause);
      window.removeEventListener('toggle-music', handleToggle);
    };
  }, []);

  const toggleMusic = () => {
    playClickSound();
    window.dispatchEvent(new CustomEvent('toggle-music'));
  };

  const handleShare = () => {
    playClickSound();
    const shareUrl = generateShareUrl(data);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Countdown', href: '#countdown' },
    { name: 'Memories', href: '#gallery' },
    { name: 'Reasons', href: '#reasons' },
    { name: 'Letter', href: '#letter' },
  ];

  const songTitle = data?.music?.songTitle || 'Happy Birthday Music 🎂';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-rose-100/80 py-3'
          : 'bg-gradient-to-b from-white/70 via-white/30 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#hero"
          onClick={() => playClickSound()}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-stone-800 leading-tight flex items-center gap-1.5">
              <span>{data?.hero?.title2 || 'Birthday Surprise'}</span>
              <Sparkles size={14} className="text-amber-400" />
            </span>
            <span className="text-[10px] tracking-wider uppercase text-rose-500 font-semibold">
              Special Celebration
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/70 p-1.5 rounded-full border border-stone-200/60 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => playClickSound()}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Widgets */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Controller Button */}
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                : 'bg-white/80 border-stone-200 text-stone-600 hover:border-rose-300'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? (
              <>
                <div className="flex items-end gap-0.5 h-3 w-3">
                  <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_300ms] h-2/3" />
                  <span className="w-0.5 bg-rose-500 rounded-full animate-[bounce_0.6s_infinite_200ms] h-full" />
                </div>
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{songTitle}</span>
                <Pause size={12} className="fill-current ml-0.5" />
              </>
            ) : (
              <>
                <Music size={14} className="text-rose-500" />
                <span className="hidden sm:inline">Play Music</span>
                <Play size={12} className="fill-current text-rose-500 ml-0.5" />
              </>
            )}
          </button>

          {/* Share Page Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Copy link to share"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="hidden sm:inline text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-rose-300" />
                <span className="hidden sm:inline">Share Link</span>
              </>
            )}
          </button>

          {/* Customize / Settings Gear (ONLY shown on edit mode, hidden on shared page) */}
          {!isSharedPage && (
            <button
              onClick={() => {
                playClickSound();
                window.dispatchEvent(new CustomEvent('open-settings'));
              }}
              className="p-2.5 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-300 rounded-full text-stone-700 hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
              title="Customize Celebration Page"
            >
              <Settings size={18} />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-rose-600 rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 space-y-2 mt-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-600"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
