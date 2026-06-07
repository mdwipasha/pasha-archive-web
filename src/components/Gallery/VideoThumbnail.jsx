import { useEffect, useState } from "react";

export default function VideoThumbnail({ image }) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = image;
    video.crossOrigin = "anonymous";

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      setThumbnail(canvas.toDataURL("image/jpeg"));
    });
  }, [image]);

  if (!thumbnail) {
    return (
      <div className="w-full h-full bg-neutral-200 animate-pulse" />
    );
  }

  return (
    <img
      src={thumbnail}
      className="w-full h-full object-cover"
      alt="video"
    />
  );
}