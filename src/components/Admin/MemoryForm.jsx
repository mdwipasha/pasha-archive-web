import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadToCloudinary } from "../../lib/cloudinary";
import LocationPicker from "./LocationPicker";

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#F3EFE6",
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  black: "#1c1b1b",
  onSurface: "#1c1b1b",
  onSurfaceVariant: "#444748",
  textSecondary: "#6B7280",
  outline: "#747878",
  outlineVariant: "#c4c7c7",
  yellow: "#FED74C",
  blue: "#BFD9FF",
  pink: "#F6D1D8",
  error: "#ffdad6",
  errorText: "#93000a",
  green: "#d4f7c5",
};

const inputStyle = {
  width: "100%",
  border: `2px solid ${C.black}`,
  background: C.surfaceAlt,
  padding: "10px 14px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: C.onSurface,
  outline: "none",
  boxShadow: `3px 3px 0px ${C.black}`,
  transition: "all 0.12s ease",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: C.onSurfaceVariant,
  marginBottom: 6,
};

const focusIn = (e) => {
  e.target.style.background = C.surface;
  e.target.style.boxShadow = "none";
  e.target.style.transform = "translate(2px,2px)";
};
const focusOut = (e) => {
  e.target.style.background = C.surfaceAlt;
  e.target.style.boxShadow = `3px 3px 0px ${C.black}`;
  e.target.style.transform = "none";
};

// ── Pick From Memory Modal ────────────────────────────────────────────────────
function PickFromMemoryModal({ open, onClose, onPick }) {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const overlayRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setLoading(true);
    supabase
      .from("memories")
      .select("id, title, location, latitude, longitude, year")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("year", { ascending: false })
      .then(({ data }) => {
        setMemories(data || []);
        setLoading(false);
      });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  if (!open) return null;

  const q = search.toLowerCase();
  const filtered = memories.filter(
    (m) =>
      !q ||
      m.title?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q),
  );

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.65)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: C.surface,
          border: `3px solid ${C.black}`,
          boxShadow: `10px 10px 0px ${C.black}`,
          width: "100%",
          maxWidth: 500,
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: C.black,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background: C.pink,
                color: C.black,
                padding: "2px 9px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Coords
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Copy from another memory
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `2px solid #444`,
              color: "#aaa",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search bar */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `2px solid ${C.black}`,
            flexShrink: 0,
          }}
        >
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or location…"
            style={{ ...inputStyle, fontSize: 13 }}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* Results list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <p
              style={{
                padding: "24px 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: C.textSecondary,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Loading memories with coordinates…
            </p>
          ) : filtered.length === 0 ? (
            <p
              style={{
                padding: "24px 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: C.textSecondary,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {search
                ? "No matches. Try a different title or location."
                : "No memories with pinned coordinates yet."}
            </p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onPick({
                    lat: m.latitude,
                    lng: m.longitude,
                    location: m.location,
                  });
                  onClose();
                }}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: `1px solid ${C.outlineVariant}`,
                  background: "transparent",
                  padding: "11px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.surfaceAlt;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Left: title + location */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.black,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 2,
                    }}
                  >
                    {m.title}
                  </div>
                  {m.location && (
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: C.onSurfaceVariant,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      📍 {m.location}
                    </div>
                  )}
                </div>

                {/* Right: coords + year */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: C.outline,
                      background: C.surfaceAlt,
                      border: `1px solid ${C.outlineVariant}`,
                      padding: "2px 7px",
                      marginBottom: 3,
                    }}
                  >
                    {Number(m.latitude).toFixed(4)},{" "}
                    {Number(m.longitude).toFixed(4)}
                  </div>
                  {m.year && (
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 10,
                        color: C.textSecondary,
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {m.year}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              padding: "8px 16px",
              borderTop: `2px solid ${C.black}`,
              background: C.surfaceAlt,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: C.onSurfaceVariant,
                fontWeight: 600,
              }}
            >
              {filtered.length}{" "}
              {filtered.length === 1 ? "memory" : "memories"} with pinned
              coords
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pick Date From Memory Modal ───────────────────────────────────────────────
function PickDateFromMemoryModal({ open, onClose, onPick, excludeId = null }) {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const overlayRef = useRef(null);
  const searchRef = useRef(null);

  function formatDate(d) {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
  }

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setLoading(true);
    supabase
      .from("memories")
      .select("id, title, date, year, location")
      .not("date", "is", null)
      .order("date", { ascending: false })
      .then(({ data }) => {
        setMemories(
          (data || []).filter((m) => excludeId == null || m.id !== excludeId),
        );
        setLoading(false);
      });
  }, [open, excludeId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  if (!open) return null;

  const q = search.toLowerCase();
  const filtered = memories.filter(
    (m) =>
      !q ||
      m.title?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q),
  );

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.65)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: C.surface,
          border: `3px solid ${C.black}`,
          boxShadow: `10px 10px 0px ${C.black}`,
          width: "100%",
          maxWidth: 500,
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: C.black,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background: C.green,
                color: C.black,
                padding: "2px 9px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Date
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Copy date from another memory
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `2px solid #444`,
              color: "#aaa",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `2px solid ${C.black}`,
            flexShrink: 0,
          }}
        >
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or location…"
            style={{ ...inputStyle, fontSize: 13 }}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <p
              style={{
                padding: "24px 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: C.textSecondary,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Loading memories with dates…
            </p>
          ) : filtered.length === 0 ? (
            <p
              style={{
                padding: "24px 18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: C.textSecondary,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {search
                ? "No matches. Try a different title or location."
                : "No other memories with a recorded date."}
            </p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onPick({ date: m.date, year: m.year });
                  onClose();
                }}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: `1px solid ${C.outlineVariant}`,
                  background: "transparent",
                  padding: "11px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.surfaceAlt; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Left: title + location */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.black,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 2,
                    }}
                  >
                    {m.title}
                  </div>
                  {m.location && (
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 11,
                        color: C.onSurfaceVariant,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      📍 {m.location}
                    </div>
                  )}
                </div>

                {/* Right: formatted date badge */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.black,
                      background: C.green,
                      border: `2px solid ${C.black}`,
                      padding: "3px 10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(m.date)}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              padding: "8px 16px",
              borderTop: `2px solid ${C.black}`,
              background: C.surfaceAlt,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: C.onSurfaceVariant,
                fontWeight: 600,
              }}
            >
              {filtered.length}{" "}
              {filtered.length === 1 ? "memory" : "memories"} with a date
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Manage Modal ───────────────────────────────────────────────────────────────

function ManageModal({
  open,
  onClose,
  tags,
  people,
  onTagsChange,
  onPeopleChange,
}) {
  const [tab, setTab] = useState("people");
  const [newPerson, setNewPerson] = useState("");
  const [newPersonSocial, setNewPersonSocial] = useState("");
  const [newTag, setNewTag] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);

  // ── Inline edit state ───────────────────────────────────────────────────────
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSocial, setEditSocial] = useState("");

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") { if (editingPersonId) { cancelEdit(); } else { onClose(); } } };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, editingPersonId]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  function startEdit(p) {
    setEditingPersonId(p.id);
    setEditName(p.name);
    setEditSocial(p.social_media || "");
    setError(null);
  }
  function cancelEdit() {
    setEditingPersonId(null);
    setEditName("");
    setEditSocial("");
  }
  async function saveEdit() {
    const name = editName.trim();
    if (!name) { setError("Name cannot be empty"); return; }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase
      .from("people")
      .update({ name, social_media: editSocial.trim() || null })
      .eq("id", editingPersonId);
    if (err) { setError(err.message); setBusy(false); return; }
    cancelEdit();
    await onPeopleChange();
    setBusy(false);
  }

  async function addPerson() {
    const name = newPerson.trim();
    if (!name) { setError("Name cannot be empty"); return; }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("people").insert({
      name,
      social_media: newPersonSocial.trim() || null,
    });
    if (err) { setError(err.message); setBusy(false); return; }
    setNewPerson("");
    setNewPersonSocial("");
    await onPeopleChange();
    setBusy(false);
  }

  async function addTag() {
    const tag = newTag.trim();
    if (!tag) { setError("Tag cannot be empty"); return; }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("tags").insert({ tag });
    if (err) { setError(err.message); setBusy(false); return; }
    setNewTag("");
    await onTagsChange();
    setBusy(false);
  }

  async function deletePerson(id, name) {
    if (!window.confirm(`Delete "${name}"? They'll be removed from all memories.`)) return;
    await supabase.from("memory_people").delete().eq("person_id", id);
    await supabase.from("people").delete().eq("id", id);
    await onPeopleChange();
  }

  async function deleteTag(id, tag) {
    if (!window.confirm(`Delete "#${tag}"? It'll be removed from all memories.`)) return;
    await supabase.from("memory_tags").delete().eq("tag_id", id);
    await supabase.from("tags").delete().eq("id", id);
    await onTagsChange();
  }

  const tabBtn = (key) => ({
    border: `2px solid ${C.black}`,
    background: tab === key ? C.black : C.surface,
    color: tab === key ? C.surface : C.black,
    padding: "8px 20px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "all 0.1s ease",
  });

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.55)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: C.surface,
          border: `3px solid ${C.black}`,
          boxShadow: `8px 8px 0px ${C.black}`,
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `2px solid ${C.black}`,
            background: C.black,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C.surface,
            }}
          >
            Manage People &amp; Tags
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `2px solid ${C.surface}`,
              color: C.surface,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", borderBottom: `2px solid ${C.black}` }}>
          <button style={tabBtn("people")} onClick={() => { setTab("people"); setError(null); }}>
            👤 People {people.length > 0 && `(${people.length})`}
          </button>
          <button style={tabBtn("tags")} onClick={() => { setTab("tags"); setError(null); }}>
            # Tags {tags.length > 0 && `(${tags.length})`}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {error && (
            <div
              style={{
                border: `2px solid ${C.black}`,
                background: C.error,
                color: C.errorText,
                padding: "8px 14px",
                marginBottom: 16,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {tab === "people" && (
            <div>
              <p style={labelStyle}>Add new person</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPerson(); } }}
                  placeholder="Name"
                  style={{ ...inputStyle, fontSize: 13 }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <input
                  type="text"
                  value={newPersonSocial}
                  onChange={(e) => setNewPersonSocial(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPerson(); } }}
                  placeholder="Social link (optional)"
                  style={{ ...inputStyle, fontSize: 13 }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <button
                onClick={addPerson}
                disabled={busy}
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.blue,
                  color: C.black,
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: busy ? "not-allowed" : "pointer",
                  boxShadow: `3px 3px 0px ${C.black}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 20,
                  opacity: busy ? 0.6 : 1,
                }}
              >
                + Add Person
              </button>

              {people.length === 0 ? (
                <p style={{ color: C.textSecondary, fontSize: 13, fontStyle: "italic" }}>
                  No people yet. Add someone above.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {people.map((p) =>
                    editingPersonId === p.id ? (
                      /* ── Edit row ─────────────────────────────────────────── */
                      <div
                        key={p.id}
                        style={{
                          border: `2px solid ${C.black}`,
                          background: C.surface,
                          padding: "8px 10px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          boxShadow: `3px 3px 0px ${C.blue}`,
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, flex: 1 }}>
                          <input
                            autoFocus
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveEdit(); } if (e.key === "Escape") cancelEdit(); }}
                            placeholder="Name"
                            style={{ ...inputStyle, fontSize: 12, padding: "6px 10px" }}
                            onFocus={focusIn}
                            onBlur={focusOut}
                          />
                          <input
                            type="text"
                            value={editSocial}
                            onChange={(e) => setEditSocial(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveEdit(); } if (e.key === "Escape") cancelEdit(); }}
                            placeholder="Social link (optional)"
                            style={{ ...inputStyle, fontSize: 12, padding: "6px 10px" }}
                            onFocus={focusIn}
                            onBlur={focusOut}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <button
                            onClick={saveEdit}
                            disabled={busy}
                            style={{
                              border: `2px solid ${C.black}`,
                              background: C.green,
                              color: C.black,
                              padding: "4px 10px",
                              fontWeight: 900,
                              fontSize: 13,
                              cursor: busy ? "not-allowed" : "pointer",
                              lineHeight: 1.4,
                              opacity: busy ? 0.6 : 1,
                            }}
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              border: `2px solid ${C.black}`,
                              background: C.surfaceAlt,
                              color: C.black,
                              padding: "4px 10px",
                              fontWeight: 900,
                              fontSize: 13,
                              cursor: "pointer",
                              lineHeight: 1.4,
                            }}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── View row ─────────────────────────────────────────── */
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: `2px solid ${C.black}`,
                          background: C.surfaceAlt,
                          padding: "8px 12px",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</span>
                          {p.social_media && (
                            <a
                              href={p.social_media}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginLeft: 10, fontSize: 11, color: C.outline, textDecoration: "underline" }}
                            >
                              {p.social_media.replace(/https?:\/\/(www\.)?/, "")}
                            </a>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => startEdit(p)}
                            disabled={busy}
                            style={{
                              border: `2px solid ${C.black}`,
                              background: C.blue,
                              color: C.black,
                              padding: "3px 9px",
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: "pointer",
                              lineHeight: 1.4,
                            }}
                            title="Edit"
                          >
                            ✏
                          </button>
                          <button
                            onClick={() => deletePerson(p.id, p.name)}
                            disabled={busy}
                            style={{
                              border: `2px solid ${C.black}`,
                              background: C.error,
                              color: C.errorText,
                              padding: "3px 9px",
                              fontWeight: 900,
                              fontSize: 13,
                              cursor: "pointer",
                              lineHeight: 1.4,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "tags" && (
            <div>
              <p style={labelStyle}>Add new tag</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Tag name"
                  style={{ ...inputStyle, fontSize: 13 }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <button
                  onClick={addTag}
                  disabled={busy}
                  style={{
                    border: `2px solid ${C.black}`,
                    background: C.yellow,
                    color: C.black,
                    padding: "8px 18px",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: busy ? "not-allowed" : "pointer",
                    boxShadow: `3px 3px 0px ${C.black}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    opacity: busy ? 0.6 : 1,
                  }}
                >
                  + Add Tag
                </button>
              </div>

              {tags.length === 0 ? (
                <p style={{ color: C.textSecondary, fontSize: 13, fontStyle: "italic" }}>
                  No tags yet. Add one above.
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        border: `2px solid ${C.black}`,
                        background: C.yellow,
                        padding: "6px 10px",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        #{t.tag}
                      </span>
                      <button
                        onClick={() => deleteTag(t.id, t.tag)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontWeight: 900,
                          fontSize: 14,
                          lineHeight: 1,
                          color: C.black,
                          padding: "0 2px",
                          opacity: 0.5,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 20px", borderTop: `2px solid ${C.black}`, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              border: `2px solid ${C.black}`,
              background: C.black,
              color: C.surface,
              padding: "8px 20px",
              fontWeight: 700,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MemoryForm({ onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [type, setType] = useState("Photo");

  const [tags, setTags] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [manageOpen, setManageOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [pickMemoryOpen, setPickMemoryOpen] = useState(false);
  const [pickDateOpen, setPickDateOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadTags();
    loadPeople();
  }, []);

  async function loadTags() {
    const { data } = await supabase.from("tags").select("*").order("tag");
    setTags(data || []);
  }

  async function loadPeople() {
    const { data } = await supabase.from("people").select("*").order("name");
    setPeople(data || []);
  }

  async function reloadTags() {
    const { data } = await supabase.from("tags").select("*").order("tag");
    const fresh = data || [];
    setTags(fresh);
    setSelectedTags((prev) => prev.filter((id) => fresh.some((t) => t.id === id)));
  }

  async function reloadPeople() {
    const { data } = await supabase.from("people").select("*").order("name");
    const fresh = data || [];
    setPeople(fresh);
    setSelectedPeople((prev) => prev.filter((id) => fresh.some((p) => p.id === id)));
  }

  function generateSlug(text) {
    return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFileChange(f) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setType(f.type.startsWith("video/") ? "Video" : "Photo");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/"))) {
      handleFileChange(f);
    }
  }

  // ── Pick-from-memory handler ───────────────────────────────────────────────
  function handlePickFromMemory({ lat, lng, location: memLoc }) {
    setLatitude(String(lat));
    setLongitude(String(lng));
    // Auto-fill location text only when the field is currently empty
    if (memLoc && !location.trim()) setLocation(memLoc);
    showToast("Coordinates copied from memory ✓");
  }

  // ── Pick date from memory handler ─────────────────────────────────────────
  function handlePickDateFromMemory({ date: memDate }) {
    setDate(memDate);
    showToast("Date copied from memory ✓");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { showToast("Please select an image first.", "error"); return; }
    setLoading(true);

    const yearFolder = date ? new Date(date).getFullYear() : "unknown";
    let cloudinary;
    try {
      cloudinary = await uploadToCloudinary(file, `pasha-archive/${yearFolder}`);
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
      return;
    }

    let thumbnail = null;
    if (cloudinary.resource_type === "video") {
      thumbnail = `https://res.cloudinary.com/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${cloudinary.public_id}.jpg`;
    }

    const { data: memory, error } = await supabase
      .from("memories")
      .insert({
        title,
        slug: generateSlug(title),
        type,
        description,
        date: date || null,
        year: date ? new Date(date).getFullYear() : null,
        location,
        latitude: latitude !== "" ? Number(latitude) : null,
        longitude: longitude !== "" ? Number(longitude) : null,
        src: cloudinary.secure_url,
        cloudinary_public_id: cloudinary.public_id,
        thumbnail_url: thumbnail,
        featured,
      })
      .select()
      .single();

    if (selectedTags.length > 0 && memory) {
      await supabase.from("memory_tags").insert(
        selectedTags.map((tagId) => ({ memory_id: memory.id, tag_id: tagId }))
      );
    }
    if (selectedPeople.length > 0 && memory) {
      await supabase.from("memory_people").insert(
        selectedPeople.map((personId) => ({ memory_id: memory.id, person_id: personId }))
      );
    }

    setLoading(false);
    if (error) { showToast(error.message, "error"); return; }

    showToast("Memory uploaded successfully!");
    setTitle("");
    setDescription("");
    setLocation("");
    setLatitude("");
    setLongitude("");
    setDate("");
    setFeatured(false);
    setFile(null);
    setPreview(null);
    setSelectedTags([]);
    setSelectedPeople([]);
    if (onSaved) onSaved();
  }

  const chipStyle = (active, accent) => ({
    border: `2px solid ${C.black}`,
    background: active ? accent : C.surface,
    color: C.black,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    boxShadow: active ? `2px 2px 0px ${C.black}` : `4px 4px 0px ${C.black}`,
    transform: active ? "translate(2px,2px)" : "none",
    transition: "all .12s ease",
  });

  const hasCoords = latitude !== "" && longitude !== "";

  return (
    <div style={{ position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            border: `3px solid ${C.black}`,
            background: toast.type === "error" ? C.error : C.green,
            color: toast.type === "error" ? C.errorText : "#1a4a0a",
            padding: "12px 20px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            boxShadow: `5px 5px 0px ${C.black}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            maxWidth: 320,
          }}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Manage Modal */}
      <ManageModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        tags={tags}
        people={people}
        onTagsChange={reloadTags}
        onPeopleChange={reloadPeople}
      />

      {/* Location Picker Modal */}
      {locationPickerOpen && (
        <LocationPicker
          lat={latitude}
          lng={longitude}
          onConfirm={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          onClose={() => setLocationPickerOpen(false)}
        />
      )}

      {/* Pick From Memory Modal */}
      <PickFromMemoryModal
        open={pickMemoryOpen}
        onClose={() => setPickMemoryOpen(false)}
        onPick={handlePickFromMemory}
      />

      {/* Pick Date From Memory Modal */}
      <PickDateFromMemoryModal
        open={pickDateOpen}
        onClose={() => setPickDateOpen(false)}
        onPick={handlePickDateFromMemory}
      />

      <form onSubmit={handleSubmit}>
        {/* Row 1: Title + Date */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
          className="form-grid-2"
        >
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Sunset at Bromo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              style={inputStyle}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={focusIn}
              onBlur={focusOut}
            />
            <button
              type="button"
              onClick={() => setPickDateOpen(true)}
              style={{
                marginTop: 6,
                border: `2px solid ${C.black}`,
                background: date ? C.green : C.surfaceAlt,
                color: C.black,
                padding: "5px 12px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: `2px 2px 0px ${C.black}`,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `2px 2px 0px ${C.black}`; }}
            >
              📅 From Memory
            </button>
          </div>
        </div>

        {/* Row 2: Location + Featured */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
          className="form-grid-2"
        >
          <div>
            <label style={labelStyle}>Location</label>
            <input
              style={inputStyle}
              placeholder="e.g. Bromo, East Java"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <label style={labelStyle}>Featured</label>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              style={{
                border: `2px solid ${C.black}`,
                background: featured ? C.yellow : C.surface,
                color: C.onSurface,
                padding: "10px 14px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: `3px 3px 0px ${C.black}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "all 0.12s ease",
                width: "100%",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`; }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: `2px solid ${C.black}`,
                  background: featured ? C.black : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {featured && (
                  <span style={{ color: C.yellow, fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>
                )}
              </span>
              {featured ? "⭐ Featured" : "Mark as Featured"}
            </button>
          </div>
        </div>

        {/* Row 3: Latitude + Longitude + Map Picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }} className="form-grid-2">
            <div>
              <label style={labelStyle}>Latitude</label>
              <input
                type="number"
                step="any"
                style={inputStyle}
                placeholder="e.g. -7.9424"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
            <div>
              <label style={labelStyle}>Longitude</label>
              <input
                type="number"
                step="any"
                style={inputStyle}
                placeholder="e.g. 112.9530"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* Map picker row — now with three buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Pick on map */}
            <button
              type="button"
              onClick={() => setLocationPickerOpen(true)}
              style={{
                border: `2px solid ${C.black}`,
                background: hasCoords ? C.yellow : C.blue,
                color: C.black,
                padding: "8px 18px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: `3px 3px 0px ${C.black}`,
                display: "flex",
                alignItems: "center",
                gap: 7,
                transition: "all 0.12s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`; }}
            >
              {hasCoords ? "Edit on Map" : "Pick on Map"}
            </button>

            {/* NEW: Pick from another memory */}
            <button
              type="button"
              onClick={() => setPickMemoryOpen(true)}
              style={{
                border: `2px solid ${C.black}`,
                background: C.pink,
                color: C.black,
                padding: "8px 18px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: `3px 3px 0px ${C.black}`,
                display: "flex",
                alignItems: "center",
                gap: 7,
                transition: "all 0.12s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`; }}
            >
              📍 From Memory
            </button>

            {hasCoords && (
              <>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: C.onSurfaceVariant,
                    background: C.surfaceAlt,
                    border: `1px solid ${C.outlineVariant}`,
                    padding: "4px 10px",
                  }}
                >
                  {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => { setLatitude(""); setLongitude(""); }}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    color: C.outline,
                    padding: "4px 6px",
                    fontWeight: 900,
                  }}
                  title="Clear coordinates"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
            placeholder="Write a short memory description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {/* People selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>People</label>
            <button
              type="button"
              onClick={() => setManageOpen(true)}
              style={{
                border: `2px solid ${C.black}`,
                background: C.surface,
                color: C.black,
                padding: "4px 10px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: `2px 2px 0px ${C.black}`,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              ⚙ Manage
            </button>
          </div>

          {people.length === 0 ? (
            <p style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic" }}>
              No people yet —{" "}
              <button
                type="button"
                onClick={() => setManageOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontStyle: "italic", fontSize: 12, color: C.textSecondary }}
              >
                add someone
              </button>
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {people.map((person) => {
                const active = selectedPeople.includes(person.id);
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() =>
                      setSelectedPeople((prev) =>
                        active ? prev.filter((id) => id !== person.id) : [...prev, person.id]
                      )
                    }
                    style={chipStyle(active, C.blue)}
                  >
                    {active ? "✓ " : ""}
                    {person.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tags selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Tags</label>
            <button
              type="button"
              onClick={() => setManageOpen(true)}
              style={{
                border: `2px solid ${C.black}`,
                background: C.surface,
                color: C.black,
                padding: "4px 10px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: `2px 2px 0px ${C.black}`,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              ⚙ Manage
            </button>
          </div>

          {tags.length === 0 ? (
            <p style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic" }}>
              No tags yet —{" "}
              <button
                type="button"
                onClick={() => setManageOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontStyle: "italic", fontSize: 12, color: C.textSecondary }}
              >
                create one
              </button>
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {tags.map((tag) => {
                const active = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        active ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                      )
                    }
                    style={chipStyle(active, C.yellow)}
                  >
                    {active ? "✓ " : ""}
                    {tag.tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Image Drop Zone */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Image / Video *</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("mem-file-input").click()}
            style={{
              border: `3px dashed ${dragOver ? C.yellow : C.black}`,
              background: dragOver ? "#FEF9E7" : C.surfaceAlt,
              cursor: "pointer",
              transition: "all 0.12s ease",
              overflow: "hidden",
              position: "relative",
              minHeight: preview ? "auto" : 120,
            }}
          >
            <input
              id="mem-file-input"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            {preview ? (
              <div style={{ position: "relative" }}>
                {file?.type.startsWith("video/") ? (
                  <video src={preview} controls style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />
                ) : (
                  <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />
                )}
                <div
                  className="img-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(28,27,27,0.55)",
                    opacity: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.15s",
                  }}
                >
                  <span style={{ color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, border: "2px solid #fff", padding: "6px 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 8, pointerEvents: "none" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: C.onSurface, margin: 0 }}>
                  Drop image/video here or click to browse
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textSecondary, margin: 0 }}>
                  PNG · JPG · WEBP · MP4 · MOV
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            border: `3px solid ${C.black}`,
            background: loading ? C.surfaceAlt : C.black,
            color: loading ? C.outline : "#FFFDF8",
            padding: "14px 24px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : `5px 5px 0px ${C.yellow}`,
            transition: "all 0.12s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "none"; } }}
          onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `5px 5px 0px ${C.yellow}`; } }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Uploading...
            </>
          ) : (
            "↑ Upload Memory"
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr !important; } }
        .img-overlay:hover { opacity: 1 !important; }
        div:hover > .img-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}