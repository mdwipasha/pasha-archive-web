import { useState } from "react";
import { createPortal } from "react-dom";
import GalleryModal from "./GalleryModal";
import VideoThumbnail from "./VideoThumbnail";

export default function GalleryCard({ memory, index = 0 }) {
  const [open, setOpen] = useState(false);

  const aspectRatios = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/2]",
    "aspect-[4/5]",
    "aspect-video",
    "aspect-square",
  ];
  const paddings = ["pb-10", "pb-12", "pb-8", "pb-10", "pb-8", "pb-12"];
  const tapeVariants = ["", "yellow", "blue", "", "blue", "yellow"];

  const tagColors = [
    "bg-[#BFD9FF]",
    "bg-[#F6D1D8]",
    "bg-[#FDE68A]",
    "bg-[#C7F9CC]",
    "bg-[#DDD6FE]",
    "bg-[#FED7AA]",
    "bg-[#FBCFE8]",
    "bg-[#A7F3D0]",
  ];

  function getTagColor(tag = "") {
    let hash = 0;

    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    return tagColors[Math.abs(hash) % tagColors.length];
  }

  const idx = index % 6;

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className={`tape ${tapeVariants[idx]}`} />
        <div
          className={`bg-[#FFFDF8] border-2 border-black p-4 ${paddings[idx]} shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-300`}
        >
          <div
            className={`w-full ${aspectRatios[idx]} bg-[#ebe7e6] border-2 border-black mb-4 overflow-hidden relative`}
          >
            {memory.type === "Video" ? (
              <img
                src={memory.thumbnail_url}
                alt={memory.title}
                class="w-full h-full object-cover"
              />
            ) : (
              <img
                src={memory.src}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="font-black text-xl mb-1">{memory.title}</h3>
              <p className="text-[14px] uppercase tracking-[0.05em] font-semibold text-[#6B7280]">
                {memory.year}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
              {(memory.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`
                  inline-block
                  px-2
                  py-1
                  border
                  border-black
                  ${getTagColor(tag)}
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                `}
                >
                  {tag}
                </span>
              ))}

              {(memory.tags || []).length > 3 && (
                <span
                  className="
                  inline-block
                  px-2
                  py-1
                  border
                  border-black
                  bg-[#E5E7EB]
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.05em]
                "
                >
                  +{(memory.tags || []).length - 3} other
                  {(memory.tags || []).length - 3 > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {open &&
        createPortal(
          <GalleryModal memory={memory} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}
