import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lexiva Intelligence Space',
    short_name: 'Lexiva',
    description: 'AI chat workspace for exploring multiple AI models in one intelligent space',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#030303',
    background_color: '#030303',
    icons: [
      {
        src: '/icons/lexiva-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/lexiva-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/lexiva-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
