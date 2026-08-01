// Utilities to encode and decode site settings into URL parameters for 100% reliable sharing
export function encodeConfigToUrl(data: any): string {
  try {
    if (!data) return '';
    const slim = {
      h: data.hero ? {
        t1: data.hero.title1,
        t2: data.hero.title2,
        s: data.hero.subtitle,
        d: data.hero.date,
        l: data.hero.location,
        b: data.hero.bgImage?.startsWith('data:') ? '' : data.hero.bgImage
      } : undefined,
      r: data.reasons ? {
        t: data.reasons.title,
        i: data.reasons.items
      } : undefined,
      l: data.letter ? {
        t: data.letter.title,
        c: data.letter.content,
        s: data.letter.sender
      } : undefined,
      m: data.music ? {
        t: data.music.songTitle,
        y: data.music.youtubeVideoId,
        c: data.music.customAudioUrl?.startsWith('data:') ? '' : data.music.customAudioUrl
      } : undefined,
      g: data.gallery?.photos ? {
        p: data.gallery.photos.map((p: any) => ({
          i: p.id,
          s: p.src?.startsWith('data:') ? '' : p.src,
          a: p.alt
        }))
      } : undefined
    };

    const jsonStr = JSON.stringify(slim);
    // encodeURIComponent handles UTF-8 characters safely
    const encoded = btoa(encodeURIComponent(jsonStr));
    return encoded;
  } catch (e) {
    console.error('Error encoding config for share link:', e);
    return '';
  }
}

export function decodeConfigFromUrl(encodedStr: string): any | null {
  try {
    if (!encodedStr) return null;
    const jsonStr = decodeURIComponent(atob(encodedStr));
    const slim = JSON.parse(jsonStr);
    if (!slim) return null;

    const result: any = {};
    if (slim.h) {
      result.hero = {
        title1: slim.h.t1,
        title2: slim.h.t2,
        subtitle: slim.h.s,
        date: slim.h.d,
        location: slim.h.l,
        bgImage: slim.h.b || undefined
      };
    }
    if (slim.r) {
      result.reasons = {
        title: slim.r.t,
        items: slim.r.i
      };
    }
    if (slim.l) {
      result.letter = {
        title: slim.l.t,
        content: slim.l.c,
        sender: slim.l.s
      };
    }
    if (slim.m) {
      result.music = {
        songTitle: slim.m.t,
        youtubeVideoId: slim.m.y,
        customAudioUrl: slim.m.c
      };
    }
    if (slim.g?.p) {
      result.gallery = {
        photos: slim.g.p.map((p: any) => ({
          id: p.i,
          src: p.s || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
          alt: p.a
        }))
      };
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch (e) {
    console.error('Error decoding config from share link:', e);
    return null;
  }
}

export function generateShareUrl(data: any): string {
  if (typeof window === 'undefined') return '';
  let baseUrl = window.location.origin + window.location.pathname;

  // Prefer shared preview domain ais-pre if currently on ais-dev
  if (baseUrl.includes('ais-dev-')) {
    baseUrl = baseUrl.replace('ais-dev-', 'ais-pre-');
  }

  const encoded = encodeConfigToUrl(data);
  if (encoded) {
    return `${baseUrl}?cfg=${encoded}`;
  }
  return baseUrl;
}
