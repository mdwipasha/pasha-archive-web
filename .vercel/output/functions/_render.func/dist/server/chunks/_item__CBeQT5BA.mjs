import { c as createComponent } from './astro-component_FQePYB_a.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CSZW9EA2.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_c_KphKF2.mjs';
import { $ as $$Navbar } from './Navbar_9haCsZMI.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_DGD5oBn6.mjs';

function CommentToast({
  show,
  success,
  message
}) {
  return /* @__PURE__ */ jsxs(
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
      `,
      children: [
        /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-base", children: success ? "check_circle" : "error" }),
        /* @__PURE__ */ jsx("span", { children: message })
      ]
    }
  );
}

function CommentForm({
  memoryId,
  visitorId,
  onCommentAdded,
  parentId = null
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: ""
  });
  useEffect(() => {
    if (!visitorId) return;
    async function checkVisitor() {
      const { data, error } = await supabase.from("comment_visitors").select("name").eq("visitor_id", visitorId).maybeSingle();
      if (!error && data) {
        setRegisteredName(data.name);
        setName(data.name);
        setIsRegistered(true);
      }
    }
    checkVisitor();
  }, [visitorId]);
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
    const body = comment.trim();
    if (!body) {
      showToast("Please write a comment before posting.", false);
      return;
    }
    let finalName = "Anonymous";
    if (!isAnonymous) {
      if (isRegistered) {
        finalName = registeredName;
      } else {
        const trimmedName = name.trim();
        if (!trimmedName) {
          showToast("Please enter a name or choose 'Comment as Anonymous'.", false);
          return;
        }
        try {
          setLoading(true);
          const { error: regError } = await supabase.from("comment_visitors").insert({ visitor_id: visitorId, name: trimmedName });
          if (regError) throw regError;
          setRegisteredName(trimmedName);
          setIsRegistered(true);
          finalName = trimmedName;
        } catch (regErr) {
          console.error("Failed to register name:", regErr);
          showToast("Unable to lock username to device: " + (regErr.message || "Error"), false);
          setLoading(false);
          return;
        }
      }
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.from("memory_comments").insert({
        memory_id: memoryId,
        username: finalName,
        comment: body,
        parent_id: parentId,
        visitor_id: visitorId,
        is_anonymous: isAnonymous
      }).select().single();
      if (error) throw error;
      onCommentAdded?.(data);
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "\n            absolute\n            -top-4\n            -right-4\n            z-10\n            w-12\n            h-12\n            flex\n            items-center\n            justify-center\n            bg-black\n            text-white\n            rounded-full\n            shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]\n          ",
          children: /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-base", children: "edit" })
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "\n            bg-white\n            p-8\n            border-2\n            border-black\n            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]\n          ",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-4", children: isAnonymous ? /* @__PURE__ */ jsx("div", { className: "mb-5 p-3 border-2 border-dashed border-gray-400 bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider", children: "👤 Posting anonymously (your name will not be shown)" }) : isRegistered ? /* @__PURE__ */ jsxs("div", { className: "mb-5 p-3 border-2 border-black bg-[#DBE9FF] text-black font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000]", children: [
              "💬 Commenting as: ",
              /* @__PURE__ */ jsx("span", { className: "underline", children: registeredName }),
              " (Locked to device)"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "\n                    block\n                    text-sm\n                    uppercase\n                    tracking-[0.2em]\n                    font-semibold\n                    mb-1\n                  ",
                  children: "Name *"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  maxLength: 60,
                  autoComplete: "name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "Enter your name (locked to this device after posting)",
                  className: "\n                    w-full\n                    h-10\n                    px-4\n                    bg-transparent\n                    border-2\n                    border-black\n                    outline-none\n                    transition-all\n                    mb-4\n                    focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\n                  "
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: `anon-check-${parentId || "main"}`,
                  checked: isAnonymous,
                  onChange: (e) => setIsAnonymous(e.target.checked),
                  className: "\n                w-5\n                h-5\n                accent-black\n                border-2\n                border-black\n                cursor-pointer\n              "
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `anon-check-${parentId || "main"}`,
                  className: "\n                text-xs\n                font-black\n                uppercase\n                tracking-wider\n                cursor-pointer\n                select-none\n              ",
                  children: "Comment as Anonymous"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "label",
              {
                className: "\n              block\n              text-sm\n              uppercase\n              tracking-[0.2em]\n              font-semibold\n              mb-1\n            ",
                children: "Add a thought to the archive"
              }
            ),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: 4,
                maxLength: 500,
                value: comment,
                onChange: (e) => setComment(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: "Write your comment here…",
                className: "\n              w-full\n              px-4\n              py-3\n              bg-transparent\n              border-2\n              border-black\n              outline-none\n              transition-all\n              resize-none\n              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\n            "
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mt-1 mb-5", children: /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-400 tabular-nums", children: [
              comment.length,
              " / 500"
            ] }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleSubmit,
                disabled: loading,
                className: "\n              cursor-pointer\n              px-8\n              py-3\n              bg-black\n              text-white\n              text-sm\n              font-semibold\n              shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]\n              hover:translate-x-1\n              hover:translate-y-1\n              transition-transform\n              disabled:opacity-50\n              disabled:pointer-events-none\n            ",
                children: loading ? "Posting..." : "Post Comment"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      CommentToast,
      {
        show: toast.show,
        success: toast.success,
        message: toast.message
      }
    )
  ] });
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
function CommentCard({ comment, index, visitorId, replies = [], onReply, onDelete }) {
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isDeleted = comment.deleted_at !== null;
  const displayUsername = isDeleted ? "[deleted]" : comment.is_anonymous ? "Anonymous" : comment.username || "Anonymous";
  async function handleDelete(id) {
    try {
      setDeletingId(id);
      const { error } = await supabase.from("memory_comments").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
      if (error) throw error;
      onDelete?.(id);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmDelete(false);
    }
  }
  return /* @__PURE__ */ jsx("article", { className: "group relative", children: /* @__PURE__ */ jsxs(
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
        `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `
                w-10
                h-10
                border-2
                border-black
                flex
                items-center
                justify-center
                font-bold
                text-sm
                shrink-0
                ${isDeleted ? "bg-gray-200" : getAvatarColor(displayUsername)}
              `,
                children: isDeleted ? "🗑" : getInitials(displayUsername)
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: `text-sm font-semibold leading-tight ${isDeleted ? "text-gray-500 italic" : "text-black"}`, children: displayUsername }),
              /* @__PURE__ */ jsx("time", { className: "text-[10px] uppercase tracking-[0.2em] text-slate-500", children: formatDate(comment.created_at) })
            ] })
          ] }),
          !isDeleted && comment.visitor_id === visitorId && /* @__PURE__ */ jsx("div", { className: "relative shrink-0", children: confirmDelete ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-2 border-black bg-[#FFD0CC] px-2 py-1 shadow-[2px_2px_0px_#000] text-xs font-bold", children: [
            /* @__PURE__ */ jsx("span", { children: "Delete?" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(comment.id),
                disabled: deletingId === comment.id,
                className: "text-red-600 underline cursor-pointer",
                children: "Yes"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setConfirmDelete(false),
                className: "text-black underline cursor-pointer",
                children: "No"
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setConfirmDelete(true),
              className: "\n                    text-[10px]\n                    uppercase\n                    tracking-[0.15em]\n                    font-black\n                    text-red-500\n                    hover:underline\n                    cursor-pointer\n                  ",
              children: "🗑 Delete"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: `text-base leading-relaxed whitespace-pre-wrap wrap-break-word ${isDeleted ? "text-gray-500 italic font-medium" : "text-[#111111]"}`, children: isDeleted ? "This comment has been deleted." : comment.comment }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-4", children: [
          !isDeleted && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onReply(comment),
              className: "\n                text-xs\n                uppercase\n                tracking-[0.15em]\n                font-bold\n                hover:underline\n                cursor-pointer\n              ",
              children: "↩ Reply"
            }
          ),
          replies.length > 0 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowReplies(!showReplies),
              className: "\n                text-xs\n                uppercase\n                tracking-[0.15em]\n                text-slate-500\n                hover:underline\n                cursor-pointer\n              ",
              children: showReplies ? "Hide replies" : `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`
            }
          )
        ] }),
        showReplies && replies.length > 0 && /* @__PURE__ */ jsx(
          "div",
          {
            className: "\n              mt-5\n              ml-6\n              pl-5\n              border-l-2\n              border-black/20\n              space-y-4\n            ",
            children: replies.map((reply) => {
              const replyDeleted = reply.deleted_at !== null;
              const replyUsername = replyDeleted ? "[deleted]" : reply.is_anonymous ? "Anonymous" : reply.username || "Anonymous";
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "\n                    bg-[#FFFDF8]\n                    border-2\n                    border-black\n                    p-4\n                  ",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2 gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: `font-semibold text-sm ${replyDeleted ? "text-gray-500 italic" : "text-black"}`, children: replyUsername }),
                        /* @__PURE__ */ jsx("time", { className: "text-[10px] uppercase tracking-[0.15em] text-slate-500", children: formatDate(reply.created_at) })
                      ] }),
                      !replyDeleted && reply.visitor_id === visitorId && /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => {
                            const confirmed = confirm("Delete this reply?");
                            if (confirmed) handleDelete(reply.id);
                          },
                          disabled: deletingId === reply.id,
                          className: "\n                          text-[10px]\n                          uppercase\n                          tracking-[0.15em]\n                          font-bold\n                          text-red-500\n                          hover:underline\n                          cursor-pointer\n                        ",
                          children: deletingId === reply.id ? "..." : "🗑 Delete"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: `text-sm whitespace-pre-wrap ${replyDeleted ? "text-gray-500 italic font-medium" : "text-black"}`, children: replyDeleted ? "This comment has been deleted." : reply.comment })
                  ]
                },
                reply.id
              );
            })
          }
        )
      ]
    }
  ) });
}

function CommentSection(props) {
  const { memoryId, initialComments = [] } = props;
  const [comments, setComments] = useState(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
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
      localStorage.setItem("visitor-id", id);
    }
    setVisitorId(id);
  }, []);
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id, visitor_id, is_anonymous, deleted_at").eq("memory_id", memoryId).order("created_at", { ascending: false });
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
  function handleCommentDeleted(commentId) {
    setComments(
      (prev) => prev.map(
        (c) => c.id === commentId ? { ...c, deleted_at: (/* @__PURE__ */ new Date()).toISOString() } : c
      )
    );
  }
  const displayedComments = showAllComments ? parentComments : parentComments.slice(0, 3);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsx(CommentForm, { memoryId, visitorId, onCommentAdded: handleCommentAdded }),
    replyingTo && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "\r\n          bg-[#FFFDF8]\r\n          border-2\r\n          border-black\r\n          p-4\r\n          mb-8\r\n          shadow-[4px_4px_0_rgba(0,0,0,1)]\r\n        ",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
              "Replying to ",
              /* @__PURE__ */ jsx("strong", { children: replyingTo.username })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setReplyingTo(null),
                className: "text-xs uppercase",
                children: "Cancel"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            CommentForm,
            {
              memoryId,
              parentId: replyingTo.id,
              visitorId,
              onCommentAdded: (newComment) => {
                handleCommentAdded(newComment);
                setReplyingTo(null);
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { "aria-label": "Reflections", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-[0.2em] font-semibold", children: "Comments" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "\r\n              text-xs\r\n              bg-black\r\n              text-white\r\n              px-2\r\n              py-0.5\r\n              font-bold\r\n              tabular-nums\r\n            ",
            children: parentComments.length
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "\r\n              absolute\r\n              left-5\r\n              top-0\r\n              bottom-0\r\n              w-[3px]\r\n              bg-black/20\r\n              -z-10\r\n            ",
            "aria-hidden": "true"
          }
        ),
        parentComments.length === 0 ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "\r\n                bg-white\r\n                p-8\r\n                border-2\r\n                border-black\r\n                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r\n              ",
            children: /* @__PURE__ */ jsx("p", { className: "text-base text-[#111111]", children: "No Comments yet. Be the first to leave one." })
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          displayedComments.map((comment, index) => /* @__PURE__ */ jsx(
            CommentCard,
            {
              comment,
              index,
              visitorId,
              replies: comments.filter(
                (reply) => reply.parent_id === comment.id
              ),
              onReply: setReplyingTo,
              onDelete: handleCommentDeleted
            },
            comment.id
          )),
          parentComments.length > 3 && !showAllComments && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowAllComments(true),
              className: "\r\n                    mt-6\r\n                    w-full\r\n                    px-4\r\n                    py-2\r\n                    cursor-pointer\r\n                    border-2 \r\n                    border-black \r\n                    bg-[#FFFDF8] \r\n                    uppercase \r\n                    tracking-[0.18em] \r\n                    text-sm \r\n                    font-black \r\n                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r\n                    transition-all duration-200 \r\n                    hover:translate-x-[2px] \r\n                    hover:translate-y-[2px] \r\n                    hover:shadow-none\r\n                  ",
              children: [
                "View More (",
                parentComments.length - 3,
                " more)"
              ]
            }
          ),
          showAllComments && parentComments.length > 3 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowAllComments(false),
              className: "\r\n                   mt-6\r\n                    w-full\r\n                    px-4\r\n                    py-2\r\n                    cursor-pointer\r\n                    border-2 \r\n                    border-black \r\n                    bg-[#FFFDF8] \r\n                    uppercase \r\n                    tracking-[0.18em] \r\n                    text-sm \r\n                    font-black \r\n                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r\n                    transition-all duration-200 \r\n                    hover:translate-x-[2px] \r\n                    hover:translate-y-[2px] \r\n                    hover:shadow-none\r\n                  ",
              children: "Show Less"
            }
          )
        ] })
      ] })
    ] })
  ] });
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
</h4> <p class="text-base italic text-[#111111]"> ${memory.description} </p> </div> </aside> <div class="md:col-span-8"> ${renderComponent($$result2, "CommentSection", CommentSection, { "client:load": true, "memoryId": memory.id, "initialComments": comments, "client:component-hydration": "load", "client:component-path": "D:/CODING/pasha-archive-web/src/components/Comments/CommentSection.jsx", "client:component-export": "default" })} </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/CODING/pasha-archive-web/src/pages/galleries/[item].astro", void 0);

const $$file = "D:/CODING/pasha-archive-web/src/pages/galleries/[item].astro";
const $$url = "/galleries/[item]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$item,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
