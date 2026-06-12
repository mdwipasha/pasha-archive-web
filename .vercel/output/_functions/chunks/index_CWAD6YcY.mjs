import { c as createComponent } from './astro-component_CJ15kxtp.mjs';
import 'piccolore';
import { q as renderComponent, u as renderTemplate, p as maybeRenderHead } from './entrypoint_BVRuuQGF.mjs';
import { a as $$Layout, $ as $$Footer } from './Footer_DbFiltz2.mjs';
import { $ as $$Navbar } from './Navbar_DqphNmkf.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { s as supabase } from './supabase_DGD5oBn6.mjs';

function ImageModal({ memory, onClose }) {
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
    "bg-[#A7F3D0]"
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
      visitor_id: visitorId
    });
    if (error) {
      return;
    }
    const newLikes = likes + 1;
    await supabase.from("memory_likes").upsert({
      memory_id: memory.id,
      count: newLikes
    });
    setLikes(newLikes);
    setLiked(true);
  }
  async function loadStats() {
    const { data } = await supabase.from("memory_liked_visitors").select("*").eq("memory_id", memory.id).eq("visitor_id", visitorId).maybeSingle();
    setLiked(!!data);
    const { data: likesData } = await supabase.from("memory_likes").select("count").eq("memory_id", memory.id).maybeSingle();
    if (likesData) {
      setLikes(likesData.count);
    }
    const { count } = await supabase.from("memory_comments").select("*", {
      count: "exact",
      head: true
    }).eq("memory_id", memory.id);
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
      crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  return /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto scrollbar-hide fixed inset-0 z-[9999] flex justify-center items-center p-4 md:p-8 bg-black/50 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsx("button", { className: "absolute inset-0 z-0", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-5xl bg-[#FFFDF8] border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6 md:p-8 rotate-[0.5deg] max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: `tape ${tapeVariant} -rotate-[2deg] top-0 left-10` }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "z-10 absolute top-4 right-4 p-2 border-2 border-black bg-[#FFFDF8] hover:bg-[#f3efe6] hover:translate-x-[2px] hover:translate-y-[2px] shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center text-black",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-2xl", children: "close" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-start gap-8 mt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full md:w-2/3 border-2 border-black p-2 bg-white", children: /* @__PURE__ */ jsx(
          "img",
          {
            alt: memory.title,
            className: "w-full h-auto border-2 border-black contrast-125",
            src: memory.src
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/3 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: (memory.tags || []).map((tag) => /* @__PURE__ */ jsxs(
              "span",
              {
                className: `
                        inline-block
                        px-2
                        py-1
                        border
                        border-black
                        ${getTagColor(tag)}
                        font-black
                        uppercase
                        text-[10px]
                      `,
                children: [
                  "#",
                  tag
                ]
              },
              tag
            )) }) }),
            /* @__PURE__ */ jsx("h2", { className: "text-1xl md:text-2xl font-black text-black mb-1 leading-tight", children: memory.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs capitalize tracking-wider font-bold text-[#6B7280] mb-4 border-b-2 border-black pb-2", children: [
              memory.date || memory.year,
              " — ",
              memory.location || "Unknown"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-[#444748] mb-4", children: memory.description }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleLike,
                  disabled: liked,
                  className: "flex items-center gap-2 px-3 py-1 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 font-title-sm cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `material-symbols-outlined ${liked ? "text-red-500 filled" : "text-black"}`,
                        children: "favorite"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: likes })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `/galleries/${memory.slug}`,
                  className: "flex items-center gap-2 px-3 py-1 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95 font-title-sm",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "chat_bubble" }),
                    /* @__PURE__ */ jsx("span", { children: commentsCount })
                  ]
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-3 border-t-2 border-black border-dashed", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.05em] font-semibold text-[#6B7280] mb-2", children: "People in Frame" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://www.instagram.com/mdpashaaa",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-[#FFFDF8] text-xs font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                    /* @__PURE__ */ jsx("p", { className: "underline", children: "Me" })
                  ]
                }
              ),
              (memory.people || []).map(
                (people, index) => people.social_media ? /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: people.social_media,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-[#FFFDF8] text-xs font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                      /* @__PURE__ */ jsx("p", { className: "underline", children: people.name })
                    ]
                  },
                  index
                ) : (
                  // no social link → plain black badge
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1 px-2 py-1 border-2 border-black bg-black text-xs font-bold text-[#FFFDF8]",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                        people.name
                      ]
                    },
                    index
                  )
                )
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function VideoModal({ memory, onClose }) {
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
    "bg-[#A7F3D0]"
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
      visitor_id: visitorId
    });
    if (error) {
      return;
    }
    const newLikes = likes + 1;
    await supabase.from("memory_likes").upsert({
      memory_id: memory.id,
      count: newLikes
    });
    setLikes(newLikes);
    setLiked(true);
  }
  async function loadStats() {
    const { data } = await supabase.from("memory_liked_visitors").select("*").eq("memory_id", memory.id).eq("visitor_id", visitorId).maybeSingle();
    setLiked(!!data);
    const { data: likesData } = await supabase.from("memory_likes").select("count").eq("memory_id", memory.id).maybeSingle();
    if (likesData) {
      setLikes(likesData.count);
    }
    const { count } = await supabase.from("memory_comments").select("*", {
      count: "exact",
      head: true
    }).eq("memory_id", memory.id);
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
      crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsx("button", { className: "absolute inset-0 z-0", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 bg-[#FFFDF8] border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-3 rotate-[0.5deg]", children: [
      /* @__PURE__ */ jsx("div", { className: `tape ${tapeVariant} -rotate-[2deg] top-0 left-10` }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 z-30", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMuted(!muted),
          className: "\r\n                absolute\r\n                w-10\r\n                h-10\r\n                top-3\r\n                left-3\r\n                bg-[#FFFDF8]\r\n                border-2\r\n                border-black\r\n                shadow-[3px_3px_0_rgba(0,0,0,1)]\r\n                flex\r\n                items-center\r\n                justify-center\r\n            ",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: muted ? "volume_off" : "volume_up" })
        }
      ) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "\r\n            absolute\r\n            w-10\r\n            h-10\r\n            top-5\r\n            right-5\r\n            z-30\r\n            p-2\r\n            border-2\r\n            border-black\r\n            bg-[#FFFDF8]\r\n            shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n            hover:translate-x-[2px]\r\n            hover:translate-y-[2px]\r\n            hover:shadow-none\r\n            flex\r\n            items-center\r\n            justify-center\r\n            transition-all\r\n          ",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "close" })
        }
      ),
      paused && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => videoRef.current?.play(),
          className: "\r\n            absolute\r\n            invisible\r\n            sm:visible\r\n            inset-0\r\n            flex\r\n            items-center\r\n            justify-center\r\n            bg-black/20\r\n            z-20\r\n            cursor-pointer\r\n            ",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "\r\n                w-16\r\n                h-16\r\n                bg-[#FFFDF8]\r\n                border-2\r\n                border-black\r\n                rounded-full\r\n                shadow-[4px_4px_0_rgba(0,0,0,1)]\r\n                flex\r\n                items-center\r\n                justify-center\r\n            ",
              children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-6xl text-black", children: "play_arrow" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative w-[360px] sm:w-[380px] h-[75vh] sm:h-[90vh] border-2 border-black overflow-hidden bg-black", children: [
        /* @__PURE__ */ jsx(
          "video",
          {
            src: memory.src,
            ref: videoRef,
            muted,
            onPause: () => setPaused(true),
            onPlay: () => setPaused(false),
            controls: true,
            autoPlay: true,
            playsInline: true,
            className: "absolute inset-0 w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "\r\n              absolute\r\n              inset-x-0\r\n              bottom-0\r\n              h-72\r\n              bg-gradient-to-t\r\n              from-black\r\n              via-black/75\r\n              sm:via-black/90\r\n              to-transparent\r\n            "
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "\r\n              absolute\r\n              right-3\r\n              bottom-24\r\n              flex\r\n              flex-col\r\n              gap-4\r\n              z-20\r\n            ",
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleLike,
                  disabled: liked,
                  className: "flex flex-col items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "\r\n                  sm:w-10\r\n                  sm:h-10\r\n                  w-12\r\n                  h-12\r\n                  bg-[#FFFDF8]\r\n                  border-2\r\n                  border-black\r\n                  shadow-[3px_3px_0_rgba(0,0,0,1)]\r\n                  flex\r\n                  items-center\r\n                  justify-center\r\n                  cursor-pointer\r\n                ",
                        children: /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `material-symbols-outlined ${liked ? "text-red-500 filled" : ""}`,
                            children: "favorite"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-black", children: likes })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `/galleries/${memory.slug}`,
                  className: "flex flex-col items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "\r\n                  sm:w-10\r\n                  sm:h-10\r\n                  w-12\r\n                  h-12\r\n                  bg-[#FFFDF8]\r\n                  border-2\r\n                  border-black\r\n                  shadow-[3px_3px_0_rgba(0,0,0,1)]\r\n                  flex\r\n                  items-center\r\n                  justify-center\r\n                ",
                        children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[8px]", children: "chat_bubble" })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-black", children: commentsCount })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "\r\n              absolute\r\n              left-4\r\n              right-20\r\n              bottom-4\r\n              z-20\r\n              text-white\r\n            ",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "font-black text-lg leading-tight mb-1", children: "mdpashaaa" }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-xs leading-relaxed ${expanded ? "" : "line-clamp-2"}`,
                  children: memory.description
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setExpanded(!expanded),
                  className: "\r\n                mt-1\r\n                text-xs\r\n                font-bold\r\n                text-white/80\r\n                hover:text-white\r\n                cursor-pointer\r\n                ",
                  children: expanded ? "View less" : "View more"
                }
              ),
              expanded && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold text-gray-400 mb-2", children: "People in Frame" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: "https://instagram.com/mdpashaaa",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "\r\n                            inline-flex\r\n                            items-center\r\n                            gap-1\r\n                            px-2\r\n                            py-1\r\n                            border-2\r\n                            border-black\r\n                            bg-[#FFFDF8]\r\n                            text-black\r\n                            text-[10px]\r\n                            font-bold\r\n                            shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n                          ",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                          "Me"
                        ]
                      }
                    ),
                    visiblePeople.map(
                      (person, index) => person.social_media ? /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: person.social_media,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "\r\n                            inline-flex\r\n                            items-center\r\n                            gap-1\r\n                            px-2\r\n                            py-1\r\n                            border-2\r\n                            border-black\r\n                            bg-[#FFFDF8]\r\n                            text-black\r\n                            text-[10px]\r\n                            font-bold\r\n                            shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n                          ",
                          children: [
                            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                            person.name
                          ]
                        },
                        index
                      ) : /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: "\r\n        inline-flex\r\n        items-center\r\n        gap-1\r\n        px-2\r\n        py-1\r\n        border\r\n        border-white/40\r\n        bg-black/30\r\n        text-white\r\n        text-[10px]\r\n      ",
                          children: [
                            /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-[12px]", children: "person" }),
                            person.name
                          ]
                        },
                        index
                      )
                    ),
                    hiddenCount > 0 && /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setShowPeopleModal(true),
                        className: "\r\n                            px-2\r\n                            py-1\r\n                            border-2\r\n                            border-black\r\n                            bg-[#FFE082]\r\n                            text-black\r\n                            text-[10px]\r\n                            font-bold\r\n                            shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n                            cursor-pointer\r\n                        ",
                        children: [
                          "+",
                          hiddenCount,
                          " More"
                        ]
                      }
                    )
                  ] })
                ] }),
                showPeopleModal && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "fixed inset-0 bg-black/50 z-[99999]",
                      onClick: () => setShowPeopleModal(false)
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "\r\n                        fixed\r\n                        bottom-0\r\n                        left-0\r\n                        right-0\r\n                        z-[100000]\r\n                        bg-[#FFFDF8]\r\n                        border-t-4\r\n                        text-black\r\n                        border-black\r\n                        shadow-[0_-6px_0_rgba(0,0,0,1)]\r\n                        p-4\r\n                        rounded-t-xl\r\n                    ",
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                          /* @__PURE__ */ jsxs("h3", { className: "font-black", children: [
                            "People in Frame (",
                            (memory.people || []).length + 1,
                            ")"
                          ] }),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: () => setShowPeopleModal(false),
                              className: "\r\n                            w-8\r\n                            h-8\r\n                            border-2\r\n                            text-black\r\n                            border-black\r\n                            bg-white\r\n                            flex\r\n                            items-center\r\n                            justify-center\r\n                            cursor-pointer\r\n                        ",
                              children: "✕"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 max-h-[50vh] overflow-y-auto", children: [
                          /* @__PURE__ */ jsxs(
                            "a",
                            {
                              href: "https://instagram.com/mdpashaaa",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "\r\n                                flex\r\n                                items-center\r\n                                justify-between\r\n                                border-2\r\n                                border-black\r\n                                bg-white\r\n                                p-2\r\n                                shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n                            ",
                              children: [
                                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                                  /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "person" }),
                                  "Me"
                                ] }),
                                /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "open_in_new" })
                              ]
                            }
                          ),
                          (memory.people || []).map(
                            (person, index) => person.social_media ? /* @__PURE__ */ jsxs(
                              "a",
                              {
                                href: person.social_media,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "\r\n                                flex\r\n                                items-center\r\n                                justify-between\r\n                                border-2\r\n                                border-black\r\n                                bg-white\r\n                                p-2\r\n                                shadow-[2px_2px_0_rgba(0,0,0,1)]\r\n                            ",
                                children: [
                                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                                    /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "person" }),
                                    person.name
                                  ] }),
                                  /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "open_in_new" })
                                ]
                              },
                              index
                            ) : /* @__PURE__ */ jsxs(
                              "div",
                              {
                                className: "\r\n                                flex\r\n                                items-center\r\n                                gap-2\r\n                                border-2\r\n                                border-black\r\n                                bg-white\r\n                                p-2\r\n                            ",
                                children: [
                                  /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined", children: "person" }),
                                  person.name
                                ]
                              },
                              index
                            )
                          )
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-2", children: [
                  memory.date || memory.year,
                  " — ",
                  memory.location
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: memory.tags?.map((tag) => /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `
                        px-2
                        py-1
                        border
                        border-black
                        ${getTagColor(tag)}
                        text-black
                        text-[10px]
                        font-black
                        uppercase
                    `,
                    children: [
                      "#",
                      tag
                    ]
                  },
                  tag
                )) })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}

function GalleryModal(props) {
  const { memory } = props;
  if (memory.type === "Video") {
    return /* @__PURE__ */ jsx(VideoModal, { ...props });
  }
  return /* @__PURE__ */ jsx(ImageModal, { ...props });
}

function GalleryCard({ memory, index = 0 }) {
  const [open, setOpen] = useState(false);
  const aspectRatios = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/2]",
    "aspect-[4/5]",
    "aspect-video",
    "aspect-square"
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
    "bg-[#A7F3D0]"
  ];
  function getTagColor(tag = "") {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return tagColors[Math.abs(hash) % tagColors.length];
  }
  const idx = index % 6;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative group cursor-pointer",
        onClick: () => setOpen(true),
        children: [
          /* @__PURE__ */ jsx("div", { className: `tape ${tapeVariants[idx]}` }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `bg-[#FFFDF8] border-2 border-black p-4 ${paddings[idx]} shadow-[4px_4px_0_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-300`,
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-full ${aspectRatios[idx]} bg-[#ebe7e6] border-2 border-black mb-4 overflow-hidden relative`,
                    children: memory.type === "Video" ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: memory.thumbnail_url,
                        alt: memory.title,
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: memory.src,
                        alt: memory.title,
                        className: "w-full h-full object-cover"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-black text-xl mb-1", children: memory.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-[14px] uppercase tracking-[0.05em] font-semibold text-[#6B7280]", children: memory.year })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 justify-end max-w-[50%]", children: [
                    (memory.tags || []).slice(0, 3).map((tag) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `
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
                `,
                        children: tag
                      },
                      tag
                    )),
                    (memory.tags || []).length > 3 && /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: "\r\n                  inline-block\r\n                  px-2\r\n                  py-1\r\n                  border\r\n                  border-black\r\n                  bg-[#E5E7EB]\r\n                  text-[10px]\r\n                  font-semibold\r\n                  uppercase\r\n                  tracking-[0.05em]\r\n                ",
                        children: [
                          "+",
                          (memory.tags || []).length - 3,
                          " other",
                          (memory.tags || []).length - 3 > 1 ? "s" : ""
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    ),
    open && createPortal(
      /* @__PURE__ */ jsx(GalleryModal, { memory, onClose: () => setOpen(false) }),
      document.body
    )
  ] });
}

const getMemoryTimestamp = (memory) => {
  if (memory.date) {
    const parsed = Date.parse(memory.date);
    if (!Number.isNaN(parsed)) return parsed;
  }
  if (memory.year) {
    const parsedYear = Date.parse(`${memory.year}-01-01`);
    if (!Number.isNaN(parsedYear)) return parsedYear;
  }
  return 0;
};
const getMemoryYear = (memory) => {
  if (memory.year) return String(memory.year);
  if (memory.date) {
    const d = new Date(memory.date);
    if (!isNaN(d)) return String(d.getFullYear());
  }
  return null;
};
const getMemoryPersonNames = (memory) => {
  return (memory.people || []).map(
    (person) => person && typeof person === "object" ? person.name : String(person || "")
  ).filter(Boolean);
};
const ROTATIONS = [
  "rotate-[1deg]",
  "-rotate-2",
  "rotate-[0.5deg]",
  "-rotate-[1deg]",
  "rotate-[2deg]",
  "-rotate-[0.5deg]"
];
function FilterGroup({ label, options, selected, onToggle, accent }) {
  if (options.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.25em] mb-2.5 opacity-40", children: label }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: options.map((opt) => {
      const active = selected.includes(opt);
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onToggle(opt),
          className: `border-2 border-black px-3 py-1.5 text-xs uppercase tracking-[0.12em] font-bold transition-all duration-150 ${active ? `${accent} shadow-none translate-x-[2px] translate-y-[2px]` : "bg-white text-black shadow-[2px_2px_0_rgb(0,0,0)] hover:bg-[#f3efe6]"}`,
          children: opt
        },
        opt
      );
    }) })
  ] });
}
function ActiveChip({ label, onRemove }) {
  return /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 border-2 border-black bg-[#FFFDF8] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-[2px_2px_0_rgb(0,0,0)]", children: [
    label,
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onRemove,
        className: "ml-0.5 text-base font-black leading-none hover:opacity-50 transition-opacity",
        "aria-label": `Remove filter ${label}`,
        children: "×"
      }
    )
  ] });
}
function GallerySection({ memories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const filterOptions = useMemo(() => {
    const tags = [...new Set(memories.flatMap((m) => m.tags || []))].sort();
    const years = [
      ...new Set(memories.map(getMemoryYear).filter(Boolean))
    ].sort((a, b) => Number(b) - Number(a));
    const locations = [
      ...new Set(memories.map((m) => m.location).filter(Boolean))
    ].sort();
    const people = [...new Set(memories.flatMap(getMemoryPersonNames))].sort();
    return { tags, years, locations, people };
  }, [memories]);
  const sortedMemories = useMemo(
    () => [...memories].sort(
      (a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a)
    ),
    [memories]
  );
  const filteredMemories = useMemo(() => {
    return sortedMemories.filter((memory) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit = (memory.title || "").toLowerCase().includes(q) || (memory.description || "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (selectedTags.length > 0) {
        if (!selectedTags.some((t) => (memory.tags || []).includes(t)))
          return false;
      }
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(getMemoryYear(memory))) return false;
      }
      if (selectedLocations.length > 0) {
        if (!selectedLocations.includes(memory.location)) return false;
      }
      if (selectedPeople.length > 0) {
        if (!selectedPeople.some((p) => getMemoryPersonNames(memory).includes(p)))
          return false;
      }
      return true;
    });
  }, [
    sortedMemories,
    searchQuery,
    selectedTags,
    selectedYears,
    selectedLocations,
    selectedPeople
  ]);
  const visibleMemories = filteredMemories.slice(0, visibleCount);
  const makeToggler = (setter) => (value) => {
    setter(
      (prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setVisibleCount(6);
  };
  const toggleTag = makeToggler(setSelectedTags);
  const toggleYear = makeToggler(setSelectedYears);
  const toggleLocation = makeToggler(setSelectedLocations);
  const togglePerson = makeToggler(setSelectedPeople);
  const clearAll = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedYears([]);
    setSelectedLocations([]);
    setSelectedPeople([]);
    setVisibleCount(6);
  };
  const totalActiveFilters = selectedTags.length + selectedYears.length + selectedLocations.length + selectedPeople.length;
  const hasActiveFilters = !!searchQuery.trim() || totalActiveFilters > 0;
  const activeChips = [
    ...selectedTags.map((v) => ({
      label: `# ${v}`,
      onRemove: () => toggleTag(v)
    })),
    ...selectedYears.map((v) => ({
      label: `📅 ${v}`,
      onRemove: () => toggleYear(v)
    })),
    ...selectedLocations.map((v) => ({
      label: `📍 ${v}`,
      onRemove: () => toggleLocation(v)
    })),
    ...selectedPeople.map((v) => ({
      label: `👤 ${v}`,
      onRemove: () => togglePerson(v)
    }))
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-30 pointer-events-none select-none", children: "🔍" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            },
            placeholder: "Search by title or description…",
            className: "w-full border-2 border-black bg-[#FFFDF8] pl-9 pr-9 py-3 font-bold text-sm placeholder:font-normal placeholder:opacity-35 shadow-[3px_3px_0_rgb(0,0,0)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all duration-150"
          }
        ),
        searchQuery && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            "aria-label": "Clear search",
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-xl font-black leading-none opacity-40 hover:opacity-80 transition-opacity",
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowFilters((v) => !v),
          className: `flex items-center gap-2 border-2 border-black px-5 py-3 uppercase tracking-[0.15em] text-sm font-black transition-all duration-150 whitespace-nowrap ${showFilters || totalActiveFilters > 0 ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" : "bg-[#FFFDF8] text-black shadow-[3px_3px_0_rgb(0,0,0)] hover:bg-[#f3efe6]"}`,
          children: [
            /* @__PURE__ */ jsx("span", { children: "Filters" }),
            totalActiveFilters > 0 && /* @__PURE__ */ jsx("span", { className: "border border-current text-[10px] font-black px-1.5 py-0.5 leading-none bg-[#FFD700] text-black border-black", children: totalActiveFilters })
          ]
        }
      )
    ] }),
    showFilters && /* @__PURE__ */ jsxs("div", { className: "border-2 border-black bg-[#FFFDF8] p-5 mb-5 shadow-[4px_4px_0_rgb(0,0,0)] flex flex-col gap-5", children: [
      /* @__PURE__ */ jsx(
        FilterGroup,
        {
          label: "Tags",
          options: filterOptions.tags,
          selected: selectedTags,
          onToggle: toggleTag,
          accent: "bg-[#FFD700]"
        }
      ),
      /* @__PURE__ */ jsx(
        FilterGroup,
        {
          label: "Year",
          options: filterOptions.years,
          selected: selectedYears,
          onToggle: toggleYear,
          accent: "bg-[#a8e6cf]"
        }
      ),
      /* @__PURE__ */ jsx(
        FilterGroup,
        {
          label: "Location",
          options: filterOptions.locations,
          selected: selectedLocations,
          onToggle: toggleLocation,
          accent: "bg-[#ffb3c6]"
        }
      ),
      /* @__PURE__ */ jsx(
        FilterGroup,
        {
          label: "People",
          options: filterOptions.people,
          selected: selectedPeople,
          onToggle: togglePerson,
          accent: "bg-[#b3d4ff]"
        }
      ),
      totalActiveFilters > 0 && /* @__PURE__ */ jsx("div", { className: "pt-3 border-t-2 border-black border-dashed", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearAll,
          className: "border-2 border-black bg-black text-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors",
          children: "Clear all filters"
        }
      ) })
    ] }),
    hasActiveFilters && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-5", children: [
      searchQuery.trim() && /* @__PURE__ */ jsx(
        ActiveChip,
        {
          label: `"${searchQuery}"`,
          onRemove: () => setSearchQuery("")
        }
      ),
      activeChips.map(({ label, onRemove }) => /* @__PURE__ */ jsx(ActiveChip, { label, onRemove }, label)),
      hasActiveFilters && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearAll,
          className: "border-2 border-black bg-black text-white px-3 py-1 text-[11px] font-black uppercase tracking-wide hover:bg-gray-800 transition-colors",
          children: "Clear all"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.2em] opacity-35 mb-10", children: filteredMemories.length === memories.length ? `${memories.length} memories` : `${filteredMemories.length} of ${memories.length} memories` }),
    visibleMemories.length > 0 ? /* @__PURE__ */ jsx("div", { className: "masonry-grid w-full", children: visibleMemories.map((memory, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: `masonry-item relative ${ROTATIONS[index % 6]}`,
        children: /* @__PURE__ */ jsx(GalleryCard, { memory, index, "client:load": true })
      },
      memory.id
    )) }) : /* @__PURE__ */ jsxs("div", { className: "border-2 border-black bg-[#FFFDF8] py-20 text-center shadow-[4px_4px_0_rgb(0,0,0)]", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: "🗂️" }),
      /* @__PURE__ */ jsx("p", { className: "font-black uppercase tracking-[0.2em] text-base mb-1", children: "No memories found" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-40 mb-6", children: "Try adjusting your filters or search" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearAll,
          className: "border-2 border-black bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors",
          children: "Clear all filters"
        }
      )
    ] }),
    visibleCount < filteredMemories.length && /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-16", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setVisibleCount((prev) => prev + 6),
        className: "border-2 border-black bg-[#FFFDF8] px-8 py-4 uppercase tracking-[0.18em] text-lg font-black shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        children: "Load More Memories"
      }
    ) })
  ] });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: memoriesData } = await supabase.from("memories").select("*");
  const { data: memoryTagsData } = await supabase.from("memory_tags").select("memory_id, tag_id");
  const { data: tagsData } = await supabase.from("tags").select("id, tag");
  const { data: memoryPeopleData } = await supabase.from("memory_people").select("memory_id, person_id");
  const { data: peopleData } = await supabase.from("people").select("id, name, social_media");
  const memoryTags = (
    /** @type {{memory_id:number, tag_id:number}[]} */
    memoryTagsData || []
  );
  const tagsList = (
    /** @type {{id:number, tag:string}[]} */
    tagsData || []
  );
  const memoryPeople = (
    /** @type {{memory_id:number, person_id:number}[]} */
    memoryPeopleData || []
  );
  const peopleList = (
    /** @type {{id:number, name:string, social_media:string | null}[]} */
    peopleData || []
  );
  const tagsById = new Map(tagsList.map((tag) => [tag.id, tag.tag]));
  const peopleById = new Map(
    peopleList.map((person) => [person.id, { name: person.name, social_media: person.social_media }])
  );
  const tagsByMemoryId = /* @__PURE__ */ new Map();
  for (const row of memoryTags) {
    const tagName = tagsById.get(row.tag_id);
    if (!tagName) continue;
    const current = tagsByMemoryId.get(row.memory_id) || [];
    current.push(tagName);
    tagsByMemoryId.set(row.memory_id, current);
  }
  const peopleByMemoryId = /* @__PURE__ */ new Map();
  for (const row of memoryPeople) {
    const person = peopleById.get(row.person_id);
    if (!person) continue;
    const current = peopleByMemoryId.get(row.memory_id) || [];
    current.push(person);
    peopleByMemoryId.set(row.memory_id, current);
  }
  const memories = (memoriesData || []).map((memory) => ({
    ...memory,
    tags: tagsByMemoryId.get(memory.id) || [],
    people: peopleByMemoryId.get(memory.id) || []
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gallery" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<div class="grain-overlay"></div> <main class="w-full px-6 md:px-16 py-12 md:py-24"> <div class="max-w-7xl mx-auto"> <div class="mb-16 flex flex-col gap-8 md:flex-row md:justify-between md:items-end"> <div> <h1 class="font-black text-4xl md:text-[4.5rem] tracking-tight text-[#1c1b1b] mb-4">
Gallery
</h1> <p class="text-lg md:text-xl leading-relaxed text-[#444748] max-w-3xl">
A collection of moments captured across time — and  memories worth keeping.
</p> </div> </div> ${renderComponent($$result2, "GallerySection", GallerySection, { "client:load": true, "memories": memories, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/mdpashaaa-archive-web/src/components/Gallery/GallerySection.jsx", "client:component-export": "default" })} </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/galleries/index.astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/galleries/index.astro";
const $$url = "/galleries";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
