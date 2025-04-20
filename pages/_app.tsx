import { AppProps } from 'next/app';
import Script from 'next/script';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://player.vdocipher.com/v2/api.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("✅ VdoCipher v2 DOM API loaded");
          console.log("window.VdoPlayer:", (window as any).VdoPlayer);
        }}
        onError={() => console.error("❌ Failed to load VdoCipher v2 script")}
      />
      <Component {...pageProps} />
    </>
  );
}
