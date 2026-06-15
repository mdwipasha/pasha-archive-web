import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function VideoModal({ memory, onClose }) {
  const [visitorId, setVisitorId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const visiblePeople = memory.people?.slice(0, 2) || [];
  const hiddenCount = (memory.people?.length || 0) - visiblePeople.length;

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
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
      <button className="absolute inset-0 z-0" onClick={onClose} />

      <div className="relative z-10 bg-[#FFFDF8] border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-3 rotate-[0.5deg]">
        <div className={`tape ${tapeVariant} -rotate-[2deg] top-0 left-10`} />

        <div className="absolute top-3 left-3 z-30">
          <button
            onClick={() => setMuted(!muted)}
            className="
                absolute
                w-10
                h-10
                top-3
                left-3
                bg-[#FFFDF8]
                border-2
                border-black
                shadow-[3px_3px_0_rgba(0,0,0,1)]
                flex
                items-center
                justify-center
            "
          >
            <span className="material-symbols-outlined">
              {muted ? "volume_off" : "volume_up"}
            </span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="
            absolute
            w-10
            h-10
            top-5
            right-5
            z-30
            p-2
            border-2
            border-black
            bg-[#FFFDF8]
            shadow-[2px_2px_0_rgba(0,0,0,1)]
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            hover:shadow-none
            flex
            items-center
            justify-center
            transition-all
          "
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {paused && (
          <button
            onClick={() => videoRef.current?.play()}
            className="
            absolute
            invisible
            sm:visible
            inset-0
            flex
            items-center
            justify-center
            bg-black/20
            z-20
            cursor-pointer
            "
          >
            <div
              className="
                w-16
                h-16
                bg-[#FFFDF8]
                border-2
                border-black
                rounded-full
                shadow-[4px_4px_0_rgba(0,0,0,1)]
                flex
                items-center
                justify-center
            "
            >
              <span className="material-symbols-outlined text-6xl text-black">
                play_arrow
              </span>
            </div>
          </button>
        )}

        <div className="relative w-[360px] sm:w-[380px] h-[75vh] sm:h-[90vh] border-2 border-black overflow-hidden bg-black">
          <video
            src={memory.src}
            ref={videoRef}
            muted={muted}
            onPause={() => setPaused(true)}
            onPlay={() => setPaused(false)}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-72
              bg-gradient-to-t
              from-black
              to-transparent
            "
          />

          <div
            className="
              absolute
              right-3
              bottom-24
              flex
              flex-col
              gap-4
              z-20
            "
          >
            <button
              onClick={handleLike}
              disabled={liked}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="
                  sm:w-10
                  sm:h-10
                  w-12
                  h-12
                  bg-[#FFFDF8]
                  border-2
                  border-black
                  shadow-[3px_3px_0_rgba(0,0,0,1)]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                "
              >
                <span
                  className={`material-symbols-outlined ${liked ? "text-red-500 filled" : ""
                    }`}
                >
                  favorite
                </span>
              </div>

              <span className="text-white text-xs font-black">{likes}</span>
            </button>

            <a
              href={`/galleries/${memory.slug}`}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="
                  sm:w-10
                  sm:h-10
                  w-12
                  h-12
                  bg-[#FFFDF8]
                  border-2
                  border-black
                  shadow-[3px_3px_0_rgba(0,0,0,1)]
                  flex
                  items-center
                  justify-center
                "
              >
                <span className="material-symbols-outlined text-[8px]">
                  chat_bubble
                </span>
              </div>

              <span className="text-white text-xs font-black">
                {commentsCount}
              </span>
            </a>
          </div>

          <div
            className="
              absolute
              left-4
              right-20
              bottom-4
              z-20
              text-white
            "
          >
            <h2 className="font-black text-lg leading-tight mb-1">mdpashaaa</h2>

            <p
              className={`text-xs leading-relaxed ${expanded ? "" : "line-clamp-2"
                }`}
            >
              {memory.description}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="
                mt-1
                text-xs
                font-bold
                text-white/80
                hover:text-white
                cursor-pointer
                "
            >
              {expanded ? "View less" : "View more"}
            </button>

            {expanded && (
              <>
                <div className="mt-3">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">
                    People in Frame
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://instagram.com/mdpashaaa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                            inline-flex
                            items-center
                            gap-1
                            px-2
                            py-1
                            border-2
                            border-black
                            bg-[#FFFDF8]
                            text-black
                            text-[10px]
                            font-bold
                            shadow-[2px_2px_0_rgba(0,0,0,1)]
                          "
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        person
                      </span>
                      Me
                    </a>
                    {visiblePeople.map((person, index) =>
                      person.social_media ? (
                        <a
                          key={index}
                          href={person.social_media}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex
                            items-center
                            gap-1
                            px-2
                            py-1
                            border-2
                            border-black
                            bg-[#FFFDF8]
                            text-black
                            text-[10px]
                            font-bold
                            shadow-[2px_2px_0_rgba(0,0,0,1)]
                          "
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            person
                          </span>
                          {person.name}
                        </a>
                      ) : (
                        <span
                          key={index}
                          className="
        inline-flex
        items-center
        gap-1
        px-2
        py-1
        border
        border-white/40
        bg-black/30
        text-white
        text-[10px]
      "
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            person
                          </span>
                          {person.name}
                        </span>
                      ),
                    )}

                    {hiddenCount > 0 && (
                      <button
                        onClick={() => setShowPeopleModal(true)}
                        className="
                            px-2
                            py-1
                            border-2
                            border-black
                            bg-[#FFE082]
                            text-black
                            text-[10px]
                            font-bold
                            shadow-[2px_2px_0_rgba(0,0,0,1)]
                            cursor-pointer
                        "
                      >
                        +{hiddenCount} More
                      </button>
                    )}
                  </div>
                </div>

                {showPeopleModal && (
                  <>
                    <button
                      className="fixed inset-0 bg-black/50 z-[99999]"
                      onClick={() => setShowPeopleModal(false)}
                    />

                    <div
                      className="
                        fixed
                        bottom-0
                        left-0
                        right-0
                        z-[100000]
                        bg-[#FFFDF8]
                        border-t-4
                        text-black
                        border-black
                        shadow-[0_-6px_0_rgba(0,0,0,1)]
                        p-4
                        rounded-t-xl
                    "
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black">
                          People in Frame ({(memory.people || []).length + 1})
                        </h3>

                        <button
                          onClick={() => setShowPeopleModal(false)}
                          className="
                            w-8
                            h-8
                            border-2
                            text-black
                            border-black
                            bg-white
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                        "
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                        <a
                          href="https://instagram.com/mdpashaaa"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                                flex
                                items-center
                                justify-between
                                border-2
                                border-black
                                bg-white
                                p-2
                                shadow-[2px_2px_0_rgba(0,0,0,1)]
                            "
                        >
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined">
                              person
                            </span>
                            Me
                          </span>

                          <span className="material-symbols-outlined">
                            open_in_new
                          </span>
                        </a>
                        {(memory.people || []).map((person, index) =>
                          person.social_media ? (
                            <a
                              key={index}
                              href={person.social_media}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                flex
                                items-center
                                justify-between
                                border-2
                                border-black
                                bg-white
                                p-2
                                shadow-[2px_2px_0_rgba(0,0,0,1)]
                            "
                            >
                              <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                  person
                                </span>
                                {person.name}
                              </span>

                              <span className="material-symbols-outlined">
                                open_in_new
                              </span>
                            </a>
                          ) : (
                            <div
                              key={index}
                              className="
                                flex
                                items-center
                                gap-2
                                border-2
                                border-black
                                bg-white
                                p-2
                            "
                            >
                              <span className="material-symbols-outlined">
                                person
                              </span>

                              {person.name}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {memory.date || memory.year} — {memory.location}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {memory.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`
                        px-2
                        py-1
                        border
                        border-black
                        ${getTagColor(tag)}
                        text-black
                        text-[10px]
                        font-black
                        uppercase
                    `}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
