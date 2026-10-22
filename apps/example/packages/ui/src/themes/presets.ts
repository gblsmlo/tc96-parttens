export type ThemePreset = {
  value: string
  title: string
  source: 'tc96' | 'coss' | 'tweakcn'
  fontsHref?: string
}

export const themePresets: ThemePreset[] = [
  {
    value: 'default',
    title: 'Default',
    source: 'tc96',
  },
  {
    value: 'stone',
    title: 'Stone',
    source: 'coss',
  },
  {
    value: 'neutral',
    title: 'Neutral',
    source: 'coss',
  },
  {
    value: 'slate',
    title: 'Slate',
    source: 'coss',
  },
  {
    value: 'zinc',
    title: 'Zinc',
    source: 'coss',
  },
  {
    value: 'amber-minimal',
    title: 'Amber Minimal',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'amethyst-haze',
    title: 'Amethyst Haze',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'bold-tech',
    title: 'Bold Tech',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'bubblegum',
    title: 'Bubblegum',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'caffeine',
    title: 'Caffeine',
    source: 'tweakcn',
  },
  {
    value: 'candyland',
    title: 'Candyland',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'catppuccin',
    title: 'Catppuccin',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'claude',
    title: 'Claude',
    source: 'tweakcn',
  },
  {
    value: 'claymorphism',
    title: 'Claymorphism',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'clean-slate',
    title: 'Clean Slate',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'cosmic-night',
    title: 'Cosmic Night',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'cyberpunk',
    title: 'Cyberpunk',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'darkmatter',
    title: 'Darkmatter',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'doom-64',
    title: 'Doom 64',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&display=swap',
  },
  {
    value: 'elegant-luxury',
    title: 'Elegant Luxury',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Libre+Baskerville:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'graphite',
    title: 'Graphite',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'kodama-grove',
    title: 'Kodama Grove',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'midnight-bloom',
    title: 'Midnight Bloom',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&display=swap',
  },
  {
    value: 'mocha-mousse',
    title: 'Mocha Mousse',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  },
  {
    value: 'modern-minimal',
    title: 'Modern Minimal',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'mono',
    title: 'Mono',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'nature',
    title: 'Nature',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Merriweather:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600;700&display=swap',
  },
  {
    value: 'neo-brutalism',
    title: 'Neo Brutalism',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'northern-lights',
    title: 'Northern Lights',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'notebook',
    title: 'Notebook',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Architects+Daughter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'ocean-breeze',
    title: 'Ocean Breeze',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'pastel-dreams',
    title: 'Pastel Dreams',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'perpetuity',
    title: 'Perpetuity',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap',
  },
  {
    value: 'quantum-rose',
    title: 'Quantum Rose',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Space+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'retro-arcade',
    title: 'Retro Arcade',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'sage-garden',
    title: 'Sage Garden',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Antic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'soft-pop',
    title: 'Soft Pop',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'solar-dusk',
    title: 'Solar Dusk',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&family=Merriweather:wght@400;500;600;700&family=Fira+Code:wght@400;500;600;700&display=swap',
  },
  {
    value: 'starry-night',
    title: 'Starry Night',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;500;600;700&display=swap',
  },
  {
    value: 'sunset-horizon',
    title: 'Sunset Horizon',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Merriweather:wght@400;500;600;700&family=Ubuntu+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'supabase',
    title: 'Supabase',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
  },
  {
    value: 't3-chat',
    title: 'T3 Chat',
    source: 'tweakcn',
  },
  {
    value: 'tangerine',
    title: 'Tangerine',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'twitter',
    title: 'Twitter',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap',
  },
  {
    value: 'vercel',
    title: 'Vercel',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'vintage-paper',
    title: 'Vintage Paper',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
  },
  {
    value: 'violet-bloom',
    title: 'Violet Bloom',
    source: 'tweakcn',
    fontsHref:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap',
  },
]
