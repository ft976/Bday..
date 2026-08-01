import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Upload, Plus, Trash2, Share2, Copy, Check } from 'lucide-react';
import { useSiteData } from './SiteDataProvider';
import { generateShareUrl } from '../lib/shareUtils';

export function SettingsModal() {
  const { data, updateData } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [localData, setLocalData] = useState(data);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploading, setUploading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [isSharedPage, setIsSharedPage] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isPreDomain = window.location.hostname.includes('ais-pre');
      const isViewMode = window.location.search.includes('view=') || window.location.search.includes('mode=view') || window.location.search.includes('cfg=');
      const hasEditParam = window.location.search.includes('edit=true') || window.location.hash === '#edit';
      setIsSharedPage((isPreDomain || isViewMode) && !hasEditParam);
    }
  }, []);

  const handleCopyLink = () => {
    const shareUrl = generateShareUrl(localData);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpen = () => {
    setLocalData(data);
    setIsOpen(true);
  };

  React.useEffect(() => {
    const handleCustomOpen = () => {
      setLocalData(data);
      setIsOpen(true);
    };
    window.addEventListener('open-settings', handleCustomOpen);
    return () => window.removeEventListener('open-settings', handleCustomOpen);
  }, [data]);

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(`photo-${index}`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newGallery = [...localData.gallery.photos];
        newGallery[index].src = event.target?.result as string;
        setLocalData({
          ...localData,
          gallery: { ...localData.gallery, photos: newGallery }
        });
        setUploading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading('hero');
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalData({
          ...localData,
          hero: { ...localData.hero, bgImage: event.target?.result as string }
        });
        setUploading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {!isSharedPage && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 left-6 z-50 p-3 bg-white/80 backdrop-blur-md border border-stone-200 rounded-full shadow-lg text-stone-600 hover:text-rose-500 hover:scale-110 transition-all cursor-pointer"
          aria-label="Settings"
          title="Customize Birthday Page"
        >
          <Settings size={24} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone-100">
                <h2 className="text-2xl font-serif text-[#2d2824]">Customize Site</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-stone-100 px-6 pt-2 gap-6 overflow-x-auto">
                {['hero', 'countdown', 'music', 'gallery', 'reasons', 'letter'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab 
                        ? 'text-rose-500 border-b-2 border-rose-500' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Subtitle</label>
                      <input 
                        type="text" 
                        value={localData.hero.subtitle}
                        onChange={(e) => setLocalData({...localData, hero: {...localData.hero, subtitle: e.target.value}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title Line 1</label>
                        <input 
                          type="text" 
                          value={localData.hero.title1}
                          onChange={(e) => setLocalData({...localData, hero: {...localData.hero, title1: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title Line 2</label>
                        <input 
                          type="text" 
                          value={localData.hero.title2}
                          onChange={(e) => setLocalData({...localData, hero: {...localData.hero, title2: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                      <textarea 
                        value={localData.hero.description}
                        onChange={(e) => setLocalData({...localData, hero: {...localData.hero, description: e.target.value}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Background Image</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                          <img src={localData.hero.bgImage} alt="Hero BG" className="w-full h-full object-cover" />
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer transition-colors">
                          <Upload size={16} />
                          <span>Upload Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'countdown' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Target Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={localData.countdown.targetDate ? localData.countdown.targetDate.slice(0, 16) : ''}
                        onChange={(e) => setLocalData({...localData, countdown: {...localData.countdown, targetDate: new Date(e.target.value).toISOString()}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'music' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Song Title</label>
                      <input 
                        type="text" 
                        value={localData.music?.songTitle || "Happy Birthday Music 🎂🎵"}
                        onChange={(e) => setLocalData({
                          ...localData, 
                          music: { ...localData.music, songTitle: e.target.value }
                        })}
                        placeholder="e.g. My Favorite Birthday Song 🎂🎵"
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                      />
                    </div>

                    {/* File Upload Section for Downloaded Audio */}
                    <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-rose-900">
                          📁 Upload Downloaded Audio File (.mp3, .wav, .m4a)
                        </label>
                        {uploading === 'music' && (
                          <span className="text-xs font-medium text-rose-500 animate-pulse">Uploading audio...</span>
                        )}
                      </div>
                      
                      {localData.music?.customAudioUrl && localData.music.customAudioUrl.startsWith('data:') ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-200">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Upload size={18} className="text-rose-500 flex-shrink-0" />
                            <span className="text-xs font-medium text-stone-700 truncate">
                              Uploaded Audio File Active
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLocalData({
                              ...localData,
                              music: { ...localData.music, customAudioUrl: '' }
                            })}
                            className="text-xs font-medium text-rose-600 hover:text-rose-800 underline cursor-pointer"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-200 hover:border-rose-400 bg-white rounded-xl cursor-pointer transition-colors group">
                          <Upload size={24} className="text-rose-400 group-hover:scale-110 transition-transform mb-2" />
                          <span className="text-sm font-medium text-rose-700">Choose Audio File from your computer/device</span>
                          <span className="text-xs text-stone-400 mt-1">Supports MP3, WAV, M4A, OGG</span>
                          <input 
                            type="file" 
                            accept="audio/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading('music');
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result as string;
                                  const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                                  setLocalData({
                                    ...localData,
                                    music: {
                                      ...localData.music,
                                      songTitle: fileNameWithoutExt || "Uploaded Song 🎵",
                                      customAudioUrl: result
                                    }
                                  });
                                  setUploading(null);
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                        </label>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Quick Birthday Music Presets</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setLocalData({
                            ...localData,
                            music: {
                              ...localData.music,
                              songTitle: "Classic Happy Birthday 🎂🎶",
                              youtubeVideoId: "aHe23q7673c",
                              customAudioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c82d416b.mp3?filename=happy-birthday-to-you-10023.mp3"
                            }
                          })}
                          className="px-3 py-2 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors cursor-pointer text-left"
                        >
                          🎉 Classic Birthday
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocalData({
                            ...localData,
                            music: {
                              ...localData.music,
                              songTitle: "Acoustic Piano Birthday 🎹✨",
                              youtubeVideoId: "2Vv-BfVoq4g",
                              customAudioUrl: ""
                            }
                          })}
                          className="px-3 py-2 text-xs font-medium bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl border border-stone-200 transition-colors cursor-pointer text-left"
                        >
                          🎹 Piano Birthday
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocalData({
                            ...localData,
                            music: {
                              ...localData.music,
                              songTitle: "Upbeat Celebration 🎈🥳",
                              youtubeVideoId: "12345678901",
                              customAudioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=happy-birthday-18531.mp3"
                            }
                          })}
                          className="px-3 py-2 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 transition-colors cursor-pointer text-left"
                        >
                          🎈 Party Celebration
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">YouTube Link or Video ID</label>
                      <input 
                        type="text" 
                        value={localData.music?.youtubeVideoId || "aHe23q7673c"}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.includes("v=")) {
                            val = val.split("v=")[1]?.split("&")[0] || val;
                          } else if (val.includes("youtu.be/")) {
                            val = val.split("youtu.be/")[1]?.split("?")[0] || val;
                          }
                          setLocalData({
                            ...localData, 
                            music: { ...localData.music, youtubeVideoId: val }
                          });
                        }}
                        placeholder="Paste YouTube Link or Video ID"
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Direct Audio / MP3 Web Link</label>
                      <input 
                        type="text" 
                        value={localData.music?.customAudioUrl || ""}
                        onChange={(e) => setLocalData({
                          ...localData, 
                          music: { ...localData.music, customAudioUrl: e.target.value }
                        })}
                        placeholder="https://example.com/happy-birthday.mp3"
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                        <input 
                          type="text" 
                          value={localData.gallery.title}
                          onChange={(e) => setLocalData({...localData, gallery: {...localData.gallery, title: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title Highlight</label>
                        <input 
                          type="text" 
                          value={localData.gallery.titleHighlight}
                          onChange={(e) => setLocalData({...localData, gallery: {...localData.gallery, titleHighlight: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                      <textarea 
                        value={localData.gallery.description}
                        onChange={(e) => setLocalData({...localData, gallery: {...localData.gallery, description: e.target.value}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none h-20 resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-stone-800">Photos</h4>
                      <button
                        onClick={() => {
                          setLocalData({
                            ...localData,
                            gallery: {
                              ...localData.gallery,
                              photos: [...localData.gallery.photos, { id: Date.now().toString(), src: '', alt: 'New Photo', aspect: 'aspect-square' }]
                            }
                          });
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <Plus size={16} /> Add Photo
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {localData.gallery.photos.map((photo: any, index: number) => (
                        <div key={photo.id || index} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-square bg-stone-100">
                          {photo.src ? (
                            <img src={photo.src} alt="Gallery" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No Image</div>
                          )}
                          {uploading === `photo-${index}` && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-rose-500 text-xs font-medium">Uploading...</div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                            <label className="cursor-pointer mb-2 flex flex-col items-center">
                              <Upload size={20} className="mb-1" />
                              <span className="text-[10px] font-medium">Change</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                            </label>
                            <button
                              onClick={() => {
                                const newGallery = localData.gallery.photos.filter((_: any, i: number) => i !== index);
                                setLocalData({...localData, gallery: {...localData.gallery, photos: newGallery}});
                              }}
                              className="text-rose-300 hover:text-white cursor-pointer"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reasons' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                        <input 
                          type="text" 
                          value={localData.reasons.title}
                          onChange={(e) => setLocalData({...localData, reasons: {...localData.reasons, title: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title Highlight</label>
                        <input 
                          type="text" 
                          value={localData.reasons.titleHighlight}
                          onChange={(e) => setLocalData({...localData, reasons: {...localData.reasons, titleHighlight: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                      <textarea 
                        value={localData.reasons.description}
                        onChange={(e) => setLocalData({...localData, reasons: {...localData.reasons, description: e.target.value}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none h-20 resize-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-stone-800">The Reasons</h4>
                      {localData.reasons.items.map((item: any, index: number) => (
                        <div key={index} className="p-4 border border-stone-200 rounded-xl space-y-3 bg-stone-50">
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">Reason {index + 1} Title</label>
                            <input 
                              type="text" 
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...localData.reasons.items];
                                newItems[index].title = e.target.value;
                                setLocalData({...localData, reasons: {...localData.reasons, items: newItems}});
                              }}
                              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">Description</label>
                            <textarea 
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...localData.reasons.items];
                                newItems[index].description = e.target.value;
                                setLocalData({...localData, reasons: {...localData.reasons, items: newItems}});
                              }}
                              className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none text-sm h-16 resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'letter' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Letter Title</label>
                      <input 
                        type="text" 
                        value={localData.letter.title}
                        onChange={(e) => setLocalData({...localData, letter: {...localData.letter, title: e.target.value}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Paragraphs (One per double line-break)</label>
                      <textarea 
                        value={localData.letter.paragraphs.join('\n\n')}
                        onChange={(e) => setLocalData({...localData, letter: {...localData.letter, paragraphs: e.target.value.split('\n\n')}})}
                        className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none h-48 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Signoff</label>
                        <input 
                          type="text" 
                          value={localData.letter.signoff}
                          onChange={(e) => setLocalData({...localData, letter: {...localData.letter, signoff: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                        <input 
                          type="text" 
                          value={localData.letter.signoffName}
                          onChange={(e) => setLocalData({...localData, letter: {...localData.letter, signoffName: e.target.value}})}
                          className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-stone-100 bg-stone-50 flex flex-col gap-4">
                {showShareSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-900"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="text-emerald-600 flex-shrink-0" size={20} />
                      <div className="text-xs sm:text-sm font-medium">
                        Page saved live! Anyone with your link will see your updated surprise!
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                    </button>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 size={16} />
                    <span>{copied ? 'Share Link Copied!' : 'Copy Page Link to Share'}</span>
                  </button>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={async () => {
                        const { adminPasscode, ...dataToSave } = localData;
                        const res = await updateData(dataToSave);
                        if (res && res.success) {
                          setShowShareSuccess(true);
                        }
                      }}
                      className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-sm shadow-rose-200 cursor-pointer"
                    >
                      Save Live
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
