import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IBS Consultancy',
    short_name: 'IBS',
    description: 'Business setup, Golden Visa & corporate advisory in the UAE.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1B2B',
    theme_color: '#0B1B2B',
    icons: [{ src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
