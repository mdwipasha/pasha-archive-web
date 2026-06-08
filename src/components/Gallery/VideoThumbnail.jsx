import { useEffect, useState } from "react";

export default function VideoThumbnail({ src, title }) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");

    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    const captureThumbnail = () => {
      video.currentTime = 0; // ambil frame detik ke-0
    };

    const handleSeeked = () => {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(video, 0, 0);

      setThumbnail(canvas.toDataURL("image/jpeg"));
    };

    video.addEventListener("loadedmetadata", captureThumbnail);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", captureThumbnail);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [src]);

  if (!thumbnail) {
    return <div className="w-full h-full bg-neutral-200 animate-pulse" />;
  }

  return (
    <img src={thumbnail} className="w-full h-full object-cover" alt={title} />
  );
}
