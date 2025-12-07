import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface PlayerProps {
  src: string;
  poster?: string;
}

export default function Player({ src, poster }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // video.play().catch(() => {}); // Auto-play might be blocked
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        // video.play().catch(() => {});
      });
    }
  }, [src]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={poster}
        playsInline
      />
    </div>
  );
}
