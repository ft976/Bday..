import { useState } from 'react';
import { SiteDataProvider, useSiteData } from './components/SiteDataProvider';
import { IntroScreen } from './components/IntroScreen';
import { FloatingHearts } from './components/FloatingHearts';
import { MusicPlayer } from './components/MusicPlayer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { Gallery } from './components/Gallery';
import { Reasons } from './components/Reasons';
import { Letter } from './components/Letter';
import { SettingsModal } from './components/SettingsModal';
import { Share2, Check } from 'lucide-react';
import { generateShareUrl } from './lib/shareUtils';

function AppContent() {
  const { data } = useSiteData();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = generateShareUrl(data);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen relative selection:bg-rose-200 selection:text-rose-900 bg-[#fdfbf7] text-[#2d2824]">
      <IntroScreen />
      <FloatingHearts />
      <Navbar />
      <MusicPlayer />
      <Hero />
      <Countdown />
      <Gallery />
      <Reasons />
      <Letter />
      <SettingsModal />
      
      <footer className="py-12 px-6 text-center text-stone-400 text-sm bg-stone-950 relative z-10 space-y-4">
        <p>Made with all my love for your special day. ❤️</p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-full text-xs font-medium border border-stone-800 transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} className="text-rose-400" />}
          <span>{copied ? 'Share Link Copied to Clipboard!' : 'Share This Birthday Surprise Page 🎁'}</span>
        </button>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}
