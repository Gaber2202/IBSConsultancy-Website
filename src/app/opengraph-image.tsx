import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IBS Consultancy — Business Setup & Golden Visa in the UAE';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #060F19 0%, #0B1B2B 55%, #12212F 100%)',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              border: '2px solid #C9A227',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            IBS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontSize: 30, fontWeight: 700 }}>IBS Consultancy</span>
            <span style={{ color: '#C9A227', fontSize: 16, letterSpacing: 4 }}>BUSINESS SETUP · UAE</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#C9A227', fontSize: 22, fontWeight: 600, letterSpacing: 3 }}>
            ELEVATE YOUR BUSINESS
          </span>
          <span style={{ color: '#fff', fontSize: 58, fontWeight: 700, lineHeight: 1.1, marginTop: 16, maxWidth: 900 }}>
            We design how your business operates in the UAE
          </span>
        </div>

        <div style={{ display: 'flex', gap: 28, color: '#94A9BE', fontSize: 22 }}>
          <span>Business Setup</span>
          <span style={{ color: '#C9A227' }}>·</span>
          <span>Golden Visa</span>
          <span style={{ color: '#C9A227' }}>·</span>
          <span>PRO Services</span>
          <span style={{ color: '#C9A227' }}>·</span>
          <span>Corporate Structuring</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
