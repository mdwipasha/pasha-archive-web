import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadToCloudinary } from "../../lib/cloudinary";

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  black: "#111111",
  surface: "#F3EFE6",
  surfaceAlt: "#EAE5DB",
  surfaceContainerHigh: "#DDD8CE",
  outline: "#999",
  outlineVariant: "#777",
  yellow: "#FED74C",
  pink: "#F6D1D8",
  blue: "#BFD9FF",
  green: "#C8F0B0",
  error: "#FFD0CC",
  errorText: "#7A0000",
};

// ── Shared input base style ────────────────────────────────────────────────────
const inputBase = {
  width: "100%",
  border: `2px solid ${C.black}`,
  background: C.surfaceAlt,
  padding: "9px 12px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: C.black,
  outline: "none",
  boxShadow: `3px 3px 0px ${C.black}`,
  transition: "all 0.1s ease",
  boxSizing: "border-box",
};

const focusHandlers = {
  onFocus: (e) => {
    e.target.style.background = C.surface;
    e.target.style.boxShadow = "none";
    e.target.style.transform = "translate(2px,2px)";
  },
  onBlur: (e) => {
    e.target.style.background = C.surfaceAlt;
    e.target.style.boxShadow = `3px 3px 0px ${C.black}`;
    e.target.style.transform = "none";
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: C.outlineVariant,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        ...inputBase,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text",
      }}
      {...focusHandlers}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...inputBase, resize: "vertical", minHeight: 72 }}
      {...focusHandlers}
    />
  );
}

/**
 * Chip — used for both tags (yellow) and people (pink).
 * Keyboard-friendly: Space/Enter toggles.
 */
function Chip({ label, selected, accent = C.yellow, onClick }) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onClick()}
      style={{
        border: `2px solid ${selected ? C.black : C.outline}`,
        background: selected ? accent : C.surfaceAlt,
        color: C.black,
        padding: "4px 11px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: "pointer",
        boxShadow: selected ? `2px 2px 0px ${C.black}` : "none",
        transition: "all 0.1s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        opacity: selected ? 1 : 0.7,
      }}
    >
      {selected && (
        <span style={{ fontSize: 9, fontWeight: 900, lineHeight: 1 }}>✓</span>
      )}
      {label}
    </button>
  );
}

function SectionDivider({ label }) {
  return (
    <div
      style={{
        borderTop: `2px dashed ${C.surfaceContainerHigh}`,
        paddingTop: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: C.outlineVariant,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.surfaceContainerHigh }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function EditMemoryModal({ memory, onClose, onSaved }) {
  // ── Core fields ───────────────────────────────────────────────────────────
  const [title, setTitle] = useState(memory.title || "");
  const [slug, setSlug] = useState(memory.slug || "");
  const [type, setType] = useState(memory.type || "Photo");
  const [description, setDescription] = useState(memory.description || "");
  const [date, setDate] = useState(memory.date || "");
  const [year, setYear] = useState(memory.year ?? "");
  const [location, setLocation] = useState(memory.location || "");
  const [src, setSrc] = useState(memory.src || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(memory.thumbnail_url || "");
  const [featured, setFeatured] = useState(memory.featured || false);

  // ── Upload / save state ───────────────────────────────────────────────────
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(memory.src || null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Tags state ────────────────────────────────────────────────────────────
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  // ── People state ──────────────────────────────────────────────────────────
  const [allPeople, setAllPeople] = useState([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState([]);

  // ── Loading for relations ──────────────────────────────────────────────────
  const [loadingRelations, setLoadingRelations] = useState(true);

  // ── Slug helpers ──────────────────────────────────────────────────────────
  const [slugTouched, setSlugTouched] = useState(false);

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }

  function handleTitleChange(e) {
    const v = e.target.value;
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function handleDateChange(e) {
    const v = e.target.value;
    setDate(v);
    if (v) setYear(new Date(v).getFullYear());
  }

  // ── Keyboard + scroll lock ────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // ── Load tags, people, and current associations ───────────────────────────
  useEffect(() => {
    (async () => {
      const [
        { data: tags, error: e1 },
        { data: people, error: e2 },
        { data: memTags, error: e3 },
        { data: memPeople, error: e4 },
      ] = await Promise.all([
        supabase.from("tags").select("id, tag").order("tag"),
        supabase.from("people").select("id, name").order("name"),
        supabase
          .from("memory_tags")
          .select("tag_id")
          .eq("memory_id", memory.id),
        supabase
          .from("memory_people")
          .select("person_id")
          .eq("memory_id", memory.id),
      ]);

      if (e1 || e2 || e3 || e4) {
        showToast("Could not load tags or people.", "error");
      }

      setAllTags(tags ?? []);
      setAllPeople(people ?? []);
      setSelectedTagIds((memTags ?? []).map((r) => r.tag_id));
      setSelectedPersonIds((memPeople ?? []).map((r) => r.person_id));
      setLoadingRelations(false);
    })();
  }, [memory.id]);

  // ── Toggle helpers ────────────────────────────────────────────────────────
  const toggleTag = (id) =>
    setSelectedTagIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  const togglePerson = (id) =>
    setSelectedPersonIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  // ── Create new tag inline ─────────────────────────────────────────────────
  async function handleCreateTag() {

    setAddingTag(true);
    const { data, error } = await supabase
      .from("tags")
      .insert({ name, slug: slugify(name) })
      .select()
      .single();

    if (error) {
      showToast(error.message, "error");
    } else {
      setAllTags((p) =>
        [...p, data].sort((a, b) => a.name.localeCompare(b.name))
      );
      setSelectedTagIds((p) => [...p, data.id]);
      showToast(`Tag "${name}" created`, "success");
    }
    setNewTagInput("");
    setAddingTag(false);
  }

  // ── File handling ─────────────────────────────────────────────────────────
  function handleFileChange(f) {
    if (!f) return;
    if (f.type.startsWith("image/") || f.type.startsWith("video/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setType(f.type.startsWith("video/") ? "Video" : "Photo");
    } else {
      showToast("Please select an image or video file.", "error");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(msg, kind = "success") {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!title.trim()) {
      showToast("Title is required.", "error");
      return;
    }
    setSaving(true);

    let updateData = {
      title,
      slug: slug || slugify(title),
      type,
      description,
      date: date || null,
      year: year !== "" ? Number(year) : null,
      location,
      featured,
      thumbnail_url: thumbnailUrl || null,
    };

    if (file) {
      try {
        setUploading(true);
        const folder = memory.year ? memory.year : new Date().getFullYear();
        const result = await uploadToCloudinary(
          file,
          `pasha-archive/${folder}`
        );

        updateData.src = result.secure_url;
        updateData.cloudinary_public_id = result.public_id;
        updateData.type = result.resource_type === "video" ? "Video" : "Photo";

        if (result.resource_type === "video") {
          updateData.thumbnail_url = `https://res.cloudinary.com/${
            import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
          }/video/upload/so_1/${result.public_id}.jpg`;
        }
      } catch (err) {
        showToast(err.message, "error");
        setSaving(false);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    } else if (src !== memory.src) {
      updateData.src = src || null;
    }

    // ── 1. Update core memory row ─────────────────────────────────────────
    const { error: memErr } = await supabase
      .from("memories")
      .update(updateData)
      .eq("id", memory.id);

    if (memErr) {
      showToast(memErr.message, "error");
      setSaving(false);
      return;
    }

    // ── 2. Sync tags (delete-then-insert) ─────────────────────────────────
    await supabase.from("memory_tags").delete().eq("memory_id", memory.id);
    if (selectedTagIds.length > 0) {
      const { error: tagErr } = await supabase
        .from("memory_tags")
        .insert(
          selectedTagIds.map((tag_id) => ({ memory_id: memory.id, tag_id }))
        );
      if (tagErr) {
        showToast(`Tags: ${tagErr.message}`, "error");
        setSaving(false);
        return;
      }
    }

    // ── 3. Sync people (delete-then-insert) ───────────────────────────────
    await supabase.from("memory_people").delete().eq("memory_id", memory.id);
    if (selectedPersonIds.length > 0) {
      const { error: personErr } = await supabase
        .from("memory_people")
        .insert(
          selectedPersonIds.map((person_id) => ({
            memory_id: memory.id,
            person_id,
          }))
        );
      if (personErr) {
        showToast(`People: ${personErr.message}`, "error");
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onSaved();
    onClose();
  }

  const busy = saving || uploading;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(17,17,17,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 10001,
            border: `3px solid ${C.black}`,
            background: toast.kind === "error" ? C.error : C.green,
            color: toast.kind === "error" ? C.errorText : "#1a4a0a",
            padding: "12px 20px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            boxShadow: `5px 5px 0px ${C.black}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {toast.kind === "error" ? "✕ " : "✓ "}
          {toast.msg}
        </div>
      )}

      {/* ── Modal shell ───────────────────────────────────────────────────── */}
      <div
        className="animate-in"
        style={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          border: `4px solid ${C.black}`,
          boxShadow: `10px 10px 0px ${C.black}`,
          background: C.surface,
          overflow: "hidden",
        }}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div
          style={{
            background: C.black,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                background: C.yellow,
                color: C.black,
                padding: "2px 10px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Edit
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                maxWidth: 340,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {memory.title || "Untitled"}
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11,
                color: "#666",
                fontWeight: 500,
              }}
            >
              #{memory.id}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              border: `2px solid #333`,
              background: "transparent",
              color: "#aaa",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.1s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#aaa";
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body: two-panel ──────────────────────────────────────────────── */}
        <div
          style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          {/* ── LEFT: media panel ─────────────────────────────────────────── */}
          <div
            style={{
              width: 240,
              flexShrink: 0,
              borderRight: `3px solid ${C.black}`,
              background: C.black,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Preview */}
            <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
              {preview ? (
                <>
                  {type === "Video" ? (
                    <video
                      src={preview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.18s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    onClick={() => document.getElementById("em-file").click()}
                  >
                    <span
                      style={{
                        background: C.yellow,
                        border: `2px solid ${C.black}`,
                        color: C.black,
                        padding: "6px 14px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        boxShadow: `3px 3px 0px ${C.black}`,
                      }}
                    >
                      ↻ Replace
                    </span>
                  </div>
                </>
              ) : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    height: "100%",
                    cursor: "pointer",
                    background: dragOver
                      ? "rgba(254,215,76,0.08)"
                      : "transparent",
                    border: `2px dashed ${dragOver ? C.yellow : "#444"}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 28 }}>📷</span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      textAlign: "center",
                    }}
                  >
                    Drop or click
                    <br />
                    to upload
                  </span>
                </label>
              )}
              <input
                id="em-file"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                style={{ display: "none" }}
              />
            </div>

            {/* Type selector */}
            <div
              style={{
                borderTop: `3px solid #333`,
                padding: "10px 12px",
                display: "flex",
                gap: 6,
              }}
            >
              {["Photo", "Video"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    flex: 1,
                    border: `2px solid ${type === t ? C.yellow : "#444"}`,
                    background: type === t ? C.yellow : "transparent",
                    color: type === t ? C.black : "#888",
                    padding: "6px 0",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                    boxShadow: type === t ? `2px 2px 0px ${C.black}` : "none",
                  }}
                >
                  {t === "Photo" ? "🖼 Photo" : "🎬 Video"}
                </button>
              ))}
            </div>

            {/* Featured toggle */}
            <div style={{ borderTop: `3px solid #333`, padding: "10px 12px" }}>
              <button
                onClick={() => setFeatured(!featured)}
                style={{
                  width: "100%",
                  border: `2px solid ${featured ? C.yellow : "#444"}`,
                  background: featured
                    ? "rgba(254,215,76,0.12)"
                    : "transparent",
                  color: featured ? C.yellow : "#666",
                  padding: "8px 12px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.12s ease",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: `2px solid ${featured ? C.yellow : "#555"}`,
                    background: featured ? C.yellow : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 9,
                    color: C.black,
                    fontWeight: 900,
                  }}
                >
                  {featured && "✓"}
                </span>
                {featured ? "Featured" : "Mark featured"}
              </button>
            </div>

            {/* Media URL inputs */}
            <div
              style={{ borderTop: `3px solid #333`, padding: "12px", flex: 1 }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#666",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Media URL
              </span>
              <input
                value={src}
                onChange={(e) => {
                  setSrc(e.target.value);
                  setPreview(e.target.value);
                }}
                placeholder="https://..."
                style={{
                  width: "100%",
                  border: "1px solid #333",
                  background: "#1a1a1a",
                  padding: "7px 10px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: "#ccc",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {type === "Video" && (
                <>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#666",
                      display: "block",
                      marginTop: 10,
                      marginBottom: 6,
                    }}
                  >
                    Thumbnail URL
                  </span>
                  <input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    style={{
                      width: "100%",
                      border: "1px solid #333",
                      background: "#1a1a1a",
                      padding: "7px 10px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      color: "#ccc",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: form fields ────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Title */}
            <Field label="Title *">
              <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Memory title"
              />
            </Field>

            {/* Slug */}
            <Field label="Slug">
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    color: C.outlineVariant,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  /
                </span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="auto-generated"
                  style={{ ...inputBase, paddingLeft: 20 }}
                  onFocus={(e) => {
                    setSlugTouched(true);
                    e.target.style.background = C.surface;
                    e.target.style.boxShadow = "none";
                    e.target.style.transform = "translate(2px,2px)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = C.surfaceAlt;
                    e.target.style.boxShadow = `3px 3px 0px ${C.black}`;
                    e.target.style.transform = "none";
                  }}
                />
              </div>
            </Field>

            {/* Date + Year */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px",
                gap: 12,
              }}
            >
              <Field label="Date">
                <Input type="date" value={date} onChange={handleDateChange} />
              </Field>
              <Field label="Year">
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                />
              </Field>
            </div>

            {/* Location */}
            <Field label="Location">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bromo, East Java"
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of this memory…"
                rows={4}
              />
            </Field>

            {/* ── TAGS ──────────────────────────────────────────────────────── */}
            <SectionDivider label="Tags" />

            <Field
              label={`Tags${
                selectedTagIds.length
                  ? ` · ${selectedTagIds.length} selected`
                  : ""
              }`}
            >
              {loadingRelations ? (
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    color: C.outlineVariant,
                    margin: 0,
                  }}
                >
                  Loading…
                </p>
              ) : (
                <>
                  {/* Existing tag chips */}
                  {allTags.length === 0 ? (
                    <p
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 11,
                        color: C.outlineVariant,
                        margin: 0,
                      }}
                    >
                      No tags yet — create one below.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {allTags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.tag}
                          selected={selectedTagIds.includes(tag.id)}
                          accent={C.yellow}
                          onClick={() => toggleTag(tag.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </Field>

            {/* ── PEOPLE ────────────────────────────────────────────────────── */}
            <SectionDivider label="People in Frame" />

            <Field
              label={`People${
                selectedPersonIds.length
                  ? ` · ${selectedPersonIds.length} tagged`
                  : ""
              }`}
            >
              {loadingRelations ? (
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    color: C.outlineVariant,
                    margin: 0,
                  }}
                >
                  Loading…
                </p>
              ) : allPeople.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    color: C.outlineVariant,
                    margin: 0,
                  }}
                >
                  No people in registry. Add them to the <code>people</code>{" "}
                  table first.
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {allPeople.map((person) => (
                    <Chip
                      key={person.id}
                      label={person.name}
                      selected={selectedPersonIds.includes(person.id)}
                      accent={C.pink}
                      onClick={() => togglePerson(person.id)}
                    />
                  ))}
                </div>
              )}
            </Field>

            {/* ── Readonly meta ─────────────────────────────────────────────── */}
            <SectionDivider label="Meta" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="ID (readonly)">
                <Input value={memory.id} disabled />
              </Field>
              <Field label="Cloudinary ID (readonly)">
                <Input value={memory.cloudinary_public_id || "—"} disabled />
              </Field>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: `3px solid ${C.black}`,
            background: C.surfaceAlt,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C.outlineVariant,
              fontWeight: 500,
            }}
          >
            {busy
              ? uploading
                ? "⏳ Uploading to Cloudinary…"
                : "⏳ Saving…"
              : `ID ${memory.id} · ${selectedTagIds.length} tag${
                  selectedTagIds.length !== 1 ? "s" : ""
                } · ${selectedPersonIds.length} person${
                  selectedPersonIds.length !== 1 ? "s" : ""
                }`}
          </span>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              disabled={busy}
              style={{
                border: `3px solid ${C.black}`,
                background: C.surface,
                color: C.black,
                padding: "10px 22px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: busy ? "not-allowed" : "pointer",
                opacity: busy ? 0.5 : 1,
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={busy}
              style={{
                border: `3px solid ${C.black}`,
                background: busy ? C.surfaceContainerHigh : C.yellow,
                color: C.black,
                padding: "10px 28px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: busy ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: busy ? 0.7 : 1,
                boxShadow: busy ? "none" : `5px 5px 0px ${C.black}`,
              }}
            >
              {busy ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      animation: "spin 0.8s linear infinite",
                      flexShrink: 0,
                    }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {uploading ? "Uploading…" : "Saving…"}
                </>
              ) : (
                "✓ Save changes"
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
