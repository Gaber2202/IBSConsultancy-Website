/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Allow localhost / 127.0.0.1 / agent desktop previews during `next dev`
  ...(isDev
    ? {
        allowedDevOrigins: ['127.0.0.1', 'localhost', '0.0.0.0'],
      }
    : {}),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Keep framing open in dev so Cursor Try Live / desktop browsers can preview.
          // Production still blocks cross-origin iframes.
          ...(isDev
            ? []
            : [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }]),
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
