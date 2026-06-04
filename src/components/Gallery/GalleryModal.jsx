import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function GalleryModal({ memory, onClose }) {
  const [visitorId, setVisitorId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);

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

  const tapeVariants = ["", "yellow", "blue"];

  const tapeVariant = tapeVariants[memory.title.length % tapeVariants.length];

  function getTagColor(tag = "") {
    let hash = 0;

    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    return tagColors[Math.abs(hash) % tagColors.length];
  }

  async function handleLike() {
    if (liked) return;

    const { error } = await supabase.from("memory_liked_visitors").insert({
      memory_id: memory.id,
      visitor_id: visitorId,
    });

    if (error) {
      return;
    }

    const newLikes = likes + 1;

    await supabase.from("memory_likes").upsert({
      memory_id: memory.id,
      count: newLikes,
    });

    setLikes(newLikes);
    setLiked(true);
  }

  async function loadStats() {
    const { data } = await supabase
      .from("memory_liked_visitors")
      .select("*")
      .eq("memory_id", memory.id)
      .eq("visitor_id", visitorId)
      .maybeSingle();

    setLiked(!!data);

    const { data: likesData } = await supabase
      .from("memory_likes")
      .select("count")
      .eq("memory_id", memory.id)
      .maybeSingle();

    if (likesData) {
      setLikes(likesData.count);
    }

    const { count } = await supabase
      .from("memory_comments")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("memory_id", memory.id);
    setCommentsCount(count || 0);
  }

  function generateVisitorId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  useEffect(() => {
    let id = localStorage.getItem("visitor-id");

    if (!id) {
      id = generateVisitorId();
      crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("visitor-id", id);
    }

    setVisitorId(id);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!visitorId) return;

    loadStats();
  }, [visitorId, memory.id]);

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 md:p-8 bg-black/50 backdrop-blur-sm">
      <button className="absolute inset-0 z-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl bg-[#FFFDF8] border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6 md:p-8 rotate-[0.5deg] max-h-[90vh] overflow-y-auto">
        <div className={`tape ${tapeVariant} -rotate-[2deg] top-0 left-10`} />

        <button
          onClick={onClose}
          className="z-10 absolute top-4 right-4 p-2 border-2 border-black bg-[#FFFDF8] hover:bg-[#f3efe6] hover:translate-x-[2px] hover:translate-y-[2px] shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center text-black"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex flex-col md:flex-row items-start gap-8 mt-4">
          <div className="w-full md:w-2/3 border-2 border-black p-2 bg-white">
            <img
              alt={memory.title}
              className="w-full h-auto border-2 border-black contrast-125"
              src={memory.image}
            />
          </div>

          <div className="w-full md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`
                      inline-block
                      px-2
                      py-1
                      border
                      border-black
                      ${getTagColor(tag)}
                      font-black
                      uppercase
                      text-[10px]
                    `}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-1xl md:text-2xl font-black text-black mb-1 leading-tight">
                {memory.title}
              </h2>

              <p className="text-xs capitalize tracking-wider font-bold text-[#6B7280] mb-4 border-b-2 border-black pb-2">
                {memory.date || memory.year} — {memory.location || "Unknown"}
              </p>

              <p className="text-xs leading-relaxed text-[#444748] mb-4">
                {memory.description}
              </p>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 font-title-sm"
                  >
                    <span
                      className={`material-symbols-outlined ${
                        liked ? "text-red-500 filled" : "text-black"
                      }`}
                    >
                      favorite
                    </span>
                    <span>{likes}</span>
                  </button>
                  <a
                    href={`/galleries/${memory.slug}`}
                    className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 font-title-sm"
                  >
                    <span className="material-symbols-outlined">
                      chat_bubble
                    </span>
                    <span>{commentsCount}</span>
                  </a>
                </div>
              </div>
            </div>

            {memory.people?.length > 0 && (
              <div className="mt-6 pt-3 border-t-2 border-black border-dashed">
                <p className="text-[10px] uppercase tracking-[0.05em] font-semibold text-[#6B7280] mb-2">
                  People in Frame
                </p>
                <div className="flex flex-wrap gap-2">
                  {memory.people.map((person, index) =>
                    person.social ? (
                      <a
                        key={index}
                        href={person.social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-[#FFFDF8] text-xs font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          person
                        </span>
                        <p className="underline">{person.name}</p>
                      </a>
                    ) : (
                      // no social link → plain black badge
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-black text-xs font-bold text-[#FFFDF8]"
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          person
                        </span>
                        {person.name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}