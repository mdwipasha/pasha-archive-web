import { c as createComponent } from './astro-component_DqjkGFZ6.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CaXNZmEO.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_k0mJAHN5.mjs';
import { $ as $$Navbar } from './Navbar_FlYiRqL1.mjs';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_DGD5oBn6.mjs';

function CommentToast({
  show,
  success,
  message
}) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        gap-3
        px-5
        py-4
        bg-black
        text-white
        text-sm
        font-semibold
        shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]
        transition-all
        duration-300
        ${show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}
      `
    },
    /* @__PURE__ */ React.createElement("span", { className: "material-symbols-outlined text-base" }, success ? "check_circle" : "error"),
    /* @__PURE__ */ React.createElement("span", null, message)
  );
}

function CommentForm({
  memoryId,
  onCommentAdded,
  parentId = null
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: ""
  });
  function showToast(message, success = true) {
    setToast({
      show: true,
      success,
      message
    });
    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false
      }));
    }, 3500);
  }
  async function handleSubmit() {
    const username = name.trim() || "Anonymous";
    const body = comment.trim();
    if (!body) {
      showToast("Please write a comment before posting.", false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.from("memory_comments").insert({
        memory_id: memoryId,
        username,
        comment: body,
        parent_id: parentId
      }).select().single();
      if (error) throw error;
      onCommentAdded?.(data);
      setName("");
      setComment("");
      showToast("Comment posted!", true);
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Unable to post comment.", false);
    } finally {
      setLoading(false);
    }
  }
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "\r\n            absolute\r\n            -top-4\r\n            -right-4\r\n            z-10\r\n            w-12\r\n            h-12\r\n            flex\r\n            items-center\r\n            justify-center\r\n            bg-black\r\n            text-white\r\n            rounded-full\r\n            shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]\r\n          "
    },
    /* @__PURE__ */ React.createElement("span", { className: "material-symbols-outlined text-base" }, "edit")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "\r\n            bg-white\r\n            p-8\r\n            border-2\r\n            border-black\r\n            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]\r\n          "
    },
    /* @__PURE__ */ React.createElement(
      "label",
      {
        className: "\r\n              block\r\n              text-sm\r\n              uppercase\r\n              tracking-[0.2em]\r\n              font-semibold\r\n              mb-1\r\n            "
      },
      "Name"
    ),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        maxLength: 60,
        autoComplete: "name",
        value: name,
        onChange: (e) => setName(e.target.value),
        placeholder: "Your name (optional)",
        className: "\r\n              w-full\r\n              h-10\r\n              px-4\r\n              bg-transparent\r\n              border-2\r\n              border-black\r\n              outline-none\r\n              transition-all\r\n              mb-5\r\n              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r\n            "
      }
    ),
    /* @__PURE__ */ React.createElement(
      "label",
      {
        className: "\r\n              block\r\n              text-sm\r\n              uppercase\r\n              tracking-[0.2em]\r\n              font-semibold\r\n              mb-1\r\n            "
      },
      "Add a thought to the archive"
    ),
    /* @__PURE__ */ React.createElement(
      "textarea",
      {
        rows: 4,
        maxLength: 500,
        value: comment,
        onChange: (e) => setComment(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: "Write your comment here…",
        className: "\r\n              w-full\r\n              px-4\r\n              py-3\r\n              bg-transparent\r\n              border-2\r\n              border-black\r\n              outline-none\r\n              transition-all\r\n              resize-none\r\n              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r\n            "
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-1 mb-5" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-slate-400 tabular-nums" }, comment.length, " / 500")),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSubmit,
        disabled: loading,
        className: "\r\n              cursor-pointer\r\n              px-8\r\n              py-3\r\n              bg-black\r\n              text-white\r\n              text-sm\r\n              font-semibold\r\n              shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]\r\n              hover:translate-x-1\r\n              hover:translate-y-1\r\n              transition-transform\r\n              disabled:opacity-50\r\n              disabled:pointer-events-none\r\n            "
      },
      loading ? "Posting..." : "Post Comment"
    )
  )), /* @__PURE__ */ React.createElement(
    CommentToast,
    {
      show: toast.show,
      success: toast.success,
      message: toast.message
    }
  ));
}

const avatarColors = [
  "bg-[#FFD6A5]",
  "bg-[#FDFFB6]",
  "bg-[#CAFFBF]",
  "bg-[#9BF6FF]",
  "bg-[#A0C4FF]",
  "bg-[#BDB2FF]",
  "bg-[#FFC6FF]",
  "bg-[#FFADAD]"
];
function getAvatarColor(name = "Anonymous") {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}
function formatDate(value) {
  if (!value) return "Just now";
  const now = /* @__PURE__ */ new Date();
  const date = new Date(value);
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1e3);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function getInitials(name) {
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function CommentCard({ comment, index, replies = [], onReply }) {
  const [showReplies, setShowReplies] = useState(false);
  return /* @__PURE__ */ React.createElement("article", { className: "group relative" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `
          bg-white
          p-6
          border-2
          border-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${index % 2 === 0 ? "rotate-[0.4deg]" : "rotate-[-0.3deg]"}
        `
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 mb-4" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `
              w-10
              h-10
              bg-[#F6D1D8]
              border-2
              border-black
              flex
              items-center
              justify-center
              font-bold
              text-sm
              shrink-0
             ${getAvatarColor(comment.username)}
            `
      },
      getInitials(comment.username || "Anonymous")
    ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold leading-tight" }, comment.username || "Anonymous"), /* @__PURE__ */ React.createElement("time", { className: "text-[10px] uppercase tracking-[0.2em] text-slate-500" }, formatDate(comment.created_at)))),
    /* @__PURE__ */ React.createElement("p", { className: "text-base leading-relaxed text-[#111111] whitespace-pre-wrap wrap-break-word" }, comment.comment),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 mt-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onReply(comment),
        className: "\r\n            text-xs\r\n            uppercase\r\n            tracking-[0.15em]\r\n            font-bold\r\n            hover:underline\r\n          "
      },
      "↩ Reply"
    ), replies.length > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowReplies(!showReplies),
        className: "\r\n              text-xs\r\n              uppercase\r\n              tracking-[0.15em]\r\n              text-slate-500\r\n              hover:underline\r\n            "
      },
      showReplies ? "Hide replies" : `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`
    )),
    showReplies && replies.length > 0 && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "\r\n            mt-5\r\n            ml-6\r\n            pl-5\r\n            border-l-2\r\n          border-black/20\r\n            space-y-4\r\n          "
      },
      replies.map((reply) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: reply.id,
          className: "\r\n              bg-[#FFFDF8]\r\n                border-2\r\n              border-black\r\n                p-4\r\n              "
        },
        /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm" }, reply.username), /* @__PURE__ */ React.createElement("time", { className: "text-[10px] uppercase tracking-[0.15em] text-slate-500" }, formatDate(reply.created_at))),
        /* @__PURE__ */ React.createElement("p", { className: "text-sm whitespace-pre-wrap" }, reply.comment)
      ))
    )
  ));
}

function CommentSection(props) {
  const { memoryId, initialComments = [] } = props;
  const [comments, setComments] = useState(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id").eq("memory_id", memoryId).order("created_at", { ascending: false });
      if (!error && data) {
        setComments(data);
      }
    }
    fetchComments();
  }, [memoryId]);
  const parentComments = comments.filter(
    (comment) => comment.parent_id === null || comment.parent_id === void 0
  );
  function handleCommentAdded(newComment) {
    setComments((prev) => [newComment, ...prev]);
  }
  const displayedComments = showAllComments ? parentComments : parentComments.slice(0, 3);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-12" }, /* @__PURE__ */ React.createElement(CommentForm, { memoryId, onCommentAdded: handleCommentAdded }), replyingTo && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "\r\n          bg-[#FFFDF8]\r\n          border-2\r\n          border-black\r\n          p-4\r\n          mb-8\r\n          shadow-[4px_4px_0_rgba(0,0,0,1)]\r\n        "
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "Replying to ", /* @__PURE__ */ React.createElement("strong", null, replyingTo.username)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setReplyingTo(null),
        className: "text-xs uppercase"
      },
      "Cancel"
    )),
    /* @__PURE__ */ React.createElement(
      CommentForm,
      {
        memoryId,
        parentId: replyingTo.id,
        onCommentAdded: (newComment) => {
          handleCommentAdded(newComment);
          setReplyingTo(null);
        }
      }
    )
  ), /* @__PURE__ */ React.createElement("section", { "aria-label": "Reflections" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm uppercase tracking-[0.2em] font-semibold" }, "Comments"), /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "\r\n              text-xs\r\n              bg-black\r\n              text-white\r\n              px-2\r\n              py-0.5\r\n              font-bold\r\n              tabular-nums\r\n            "
    },
    parentComments.length
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-6 relative" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "\r\n              absolute\r\n              left-5\r\n              top-0\r\n              bottom-0\r\n              w-[3px]\r\n              bg-black/20\r\n              -z-10\r\n            ",
      "aria-hidden": "true"
    }
  ), parentComments.length === 0 ? /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "\r\n                bg-white\r\n                p-8\r\n                border-2\r\n                border-black\r\n                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r\n              "
    },
    /* @__PURE__ */ React.createElement("p", { className: "text-base text-[#111111]" }, "No Comments yet. Be the first to leave one.")
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, displayedComments.map((comment, index) => /* @__PURE__ */ React.createElement(
    CommentCard,
    {
      key: comment.id,
      comment,
      index,
      replies: comments.filter(
        (reply) => reply.parent_id === comment.id
      ),
      onReply: setReplyingTo
    }
  )), parentComments.length > 3 && !showAllComments && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowAllComments(true),
      className: "\r\n                    mt-6\r\n                    w-full\r\n                    px-4\r\n                    py-2\r\n                    cursor-pointer\r\n                    border-2 \r\n                    border-black \r\n                    bg-[#FFFDF8] \r\n                    uppercase \r\n                    tracking-[0.18em] \r\n                    text-sm \r\n                    font-black \r\n                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r\n                    transition-all duration-200 \r\n                    hover:translate-x-[2px] \r\n                    hover:translate-y-[2px] \r\n                    hover:shadow-none\r\n                  "
    },
    "View More (",
    parentComments.length - 3,
    " more)"
  ), showAllComments && parentComments.length > 3 && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowAllComments(false),
      className: "\r\n                   mt-6\r\n                    w-full\r\n                    px-4\r\n                    py-2\r\n                    cursor-pointer\r\n                    border-2 \r\n                    border-black \r\n                    bg-[#FFFDF8] \r\n                    uppercase \r\n                    tracking-[0.18em] \r\n                    text-sm \r\n                    font-black \r\n                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r\n                    transition-all duration-200 \r\n                    hover:translate-x-[2px] \r\n                    hover:translate-y-[2px] \r\n                    hover:shadow-none\r\n                  "
    },
    "Show Less"
  )))));
}

const $$item = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$item;
  const { item } = Astro2.params;
  const { data, error } = await supabase.from("memories").select("*").eq("slug", item).maybeSingle();
  if (error || !data) {
    return Astro2.redirect("/404");
  }
  const { data: memoryTagsData } = await supabase.from("memory_tags").select("tag_id").eq("memory_id", data.id);
  const tagIds = (memoryTagsData || []).map((row) => row.tag_id);
  const { data: tagsData } = tagIds.length ? await supabase.from("tags").select("id, tag").in("id", tagIds) : { data: [] };
  const { data: memoryPeopleData } = await supabase.from("memory_people").select("person_id").eq("memory_id", data.id);
  const personIds = (memoryPeopleData || []).map((row) => row.person_id);
  const { data: peopleData } = personIds.length ? await supabase.from("people").select("id, name, social_media").in("id", personIds) : { data: [] };
  const memory = {
    ...data,
    tags: (tagsData || []).map((tag) => tag.tag),
    people: (peopleData || []).map((person) => ({
      name: person.name,
      social: person.social_media,
      social_media: person.social_media
    }))
  };
  const { data: commentsRes } = await supabase.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id").eq("memory_id", data.id).order("created_at", {
    ascending: false
  });
  const comments = commentsRes ?? [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${memory.title}` }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="max-w-5xl mx-auto px-6 md:px-16 py-12"> <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"> <div class="relative inline-block"> <div class="absolute -top-6 -left-4 w-24 h-8 bg-[#F6D1D8] opacity-60 scrapbook-tape -rotate-12 z-0"></div> <h1 class="font-[Space_Grotesk] text-5xl md:text-6xl font-bold text-black relative z-10"> ${memory.title} </h1> </div> <a href="/galleries" class="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform active:scale-95 self-start"> <span class="material-symbols-outlined text-base leading-none">
arrow_back
</span> <span class="font-semibold text-sm"> Back to Gallery </span> </a> </div> <div class="grid grid-cols-1 md:grid-cols-12 gap-12"> <aside class="md:col-span-4 space-y-8"> <div class="bg-white aspect-square p-2 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[-1.5deg] relative"> ${memory.type === "Video" ? renderTemplate`<img${addAttribute(memory.thumbnail_url, "src")}${addAttribute(memory.title, "alt")} class="w-full aspect-square object-cover mb-4">` : renderTemplate`<img${addAttribute(memory.src, "src")}${addAttribute(memory.title, "alt")} class="w-full aspect-square object-cover mb-4">`} <div class="px-2 pb-2"> <span class="text-[12px] uppercase tracking-[0.2em] text-slate-500"> ${memory.date || memory.year} </span> </div> </div> <div class="bg-[#BFD9FF]/20 p-6 border-2 border-black border-dashed"> <h4 class="uppercase tracking-[0.2em] text-[11px] text-black mb-2">
Archive Note
</h4> <p class="text-base italic text-[#111111]"> ${memory.description} </p> </div> </aside> <div class="md:col-span-8"> ${renderComponent($$result2, "CommentSection", CommentSection, { "client:load": true, "memoryId": memory.id, "initialComments": comments, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/mdpashaaa-archive-web/src/components/Comments/CommentSection.jsx", "client:component-export": "default" })} </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/galleries/[item].astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/galleries/[item].astro";
const $$url = "/galleries/[item]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$item,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
