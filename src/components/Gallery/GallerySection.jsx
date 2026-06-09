import { useMemo, useState } from "react";
import GalleryCard from "./GalleryCard";

const getMemoryTimestamp = (memory) => {
  if (memory.date) {
    const parsed = Date.parse(memory.date);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (memory.year) {
    const parsedYear = Date.parse(`${memory.year}-01-01`);
    if (!Number.isNaN(parsedYear)) {
      return parsedYear;
    }
  }

  return 0;
};

export default function GallerySection({ memories }) {
  const [selectedTag, setSelectedTag] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const tags = useMemo(() => {
    const allTags = memories.flatMap((memory) => memory.tags || []);
    return ["all", ...new Set(allTags)];
  }, [memories]);

  const sortedMemories = useMemo(() => {
    return [...memories].sort((a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a));
  }, [memories]);

  const filteredMemories = useMemo(() => {
    if (selectedTag === "all") {
      return sortedMemories;
    }
    return sortedMemories.filter((memory) => (memory.tags || []).includes(selectedTag));
  }, [selectedTag, sortedMemories]);

  const visibleMemories = filteredMemories.slice(0, visibleCount);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-14">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTag(tag);
              setVisibleCount(6);
            }}
            className={`border-2 border-black px-4 py-2 uppercase tracking-[0.18em] text-sm font-bold shadow-[2px_2px_0_rgb(0,0,0)] transition-all duration-200 ${
              selectedTag === tag
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-[#f3efe6]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="masonry-grid w-full">
        {visibleMemories.map((memory, index) => (
          <div
            key={memory.id}
            className={`masonry-item relative ${[
              "rotate-[1deg]",
              "-rotate-2",
              "rotate-[0.5deg]",
              "-rotate-[1deg]",
              "rotate-[2deg]",
              "-rotate-[0.5deg]",
            ][index % 6]}`}
          >
            <GalleryCard memory={memory} index={index} client:load />
          </div>
        ))}
      </div>

      {visibleCount < filteredMemories.length && (
        <div className="flex justify-center mt-16">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="border-2 border-black bg-[#FFFDF8] px-8 py-4 uppercase tracking-[0.18em] text-lg font-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Load More Memories
          </button>
        </div>
      )}
    </div>
  );
}
