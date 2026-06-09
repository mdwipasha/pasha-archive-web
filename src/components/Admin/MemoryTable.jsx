import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import EditMemoryModal from "./EditMemoryModal";

// ── Design tokens from DESIGN.md ──
const C = {
  bg: "#F3EFE6",
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  surfaceContainerHigh: "#ebe7e6",
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
};

export default function MemoryTable({ refreshKey }) {
  const [memories, setMemories] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  async function loadMemories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setMemories(data || []);
    setLoading(false);
  }

  async function deleteMemory(memory) {
    const confirmed = confirm(
      `Delete "${memory.title}"?\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;
    setDeletingId(memory.id);

    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: memory.cloudinary_public_id,
        type: memory.type,
      }),
    });

    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", memory.id);
    if (error) console.error(error);
    setDeletingId(null);
    loadMemories();
  }

  useEffect(() => {
    loadMemories();
  }, [refreshKey]);

  const filtered = memories.filter(
    (m) =>
      (m.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.location || "").toLowerCase().includes(search.toLowerCase()) ||
      String(m.year || "").includes(search),
  );

  return (
    <div>
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `2px solid ${C.outlineVariant}`,
        }}
      >
        {/* Count badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              border: `2px solid ${C.black}`,
              background: C.yellow,
              padding: "4px 12px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              boxShadow: `2px 2px 0px ${C.black}`,
            }}
          >
            {filtered.length}
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: C.onSurfaceVariant,
            }}
          >
            of {memories.length} memories
          </span>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 13,
              color: C.outline,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search title, location, year…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: `2px solid ${C.black}`,
              background: C.surfaceAlt,
              padding: "8px 14px 8px 30px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: C.onSurface,
              outline: "none",
              boxShadow: `3px 3px 0px ${C.black}`,
              transition: "all 0.12s ease",
              width: 240,
            }}
            onFocus={(e) => {
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
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0",
            gap: 12,
            color: C.onSurfaceVariant,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spin 0.8s linear infinite" }}
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
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Loading…
          </span>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div
          style={{
            border: `3px dashed ${C.outlineVariant}`,
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            background: C.surfaceAlt,
          }}
        >
          <span style={{ fontSize: 48 }}>📭</span>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: C.onSurface,
              margin: 0,
            }}
          >
            No memories found
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                border: `2px solid ${C.black}`,
                background: C.yellow,
                padding: "6px 16px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: `3px 3px 0px ${C.black}`,
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px,2px)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`;
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* ── Memory Cards Grid ── */}
      {!loading && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              deletingId={deletingId}
              onEdit={() => setEditingMemory(memory)}
              onDelete={() => deleteMemory(memory)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMemory && (
        <EditMemoryModal
          memory={editingMemory}
          onClose={() => setEditingMemory(null)}
          onSaved={loadMemories}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function MemoryCard({ memory, deletingId, onEdit, onDelete }) {
  const C_local = {
    black: "#1c1b1b",
    surface: "#FFFDF8",
    yellow: "#FED74C",
    blue: "#BFD9FF",
    pink: "#F6D1D8",
    error: "#ffdad6",
    surfaceAlt: "#ECE6D8",
    outlineVariant: "#c4c7c7",
    onSurface: "#1c1b1b",
    onSurfaceVariant: "#444748",
    textSecondary: "#6B7280",
  };
  const isDeleting = deletingId === memory.id;

  return (
    <div
      style={{
        border: `3px solid ${C_local.black}`,
        background: C_local.surface,
        boxShadow: `5px 5px 0px ${C_local.black}`,
        overflow: "hidden",
        transition: "all 0.12s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(3px,3px)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = `5px 5px 0px ${C_local.black}`;
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          height: 160,
          borderBottom: `3px solid ${C_local.black}`,
          background: C_local.surfaceAlt,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {memory.type === "Photo" ? (
          <img
            src={memory.src}
            alt={memory.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div style={{ position: "relative" }}>
            <img src={memory.thumbnail_url} />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ▶️
            </div>
          </div>
        )}

        {/* Featured badge — tape style */}
        {memory.featured && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              border: `2px solid ${C_local.black}`,
              background: C_local.yellow,
              padding: "3px 8px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              boxShadow: `2px 2px 0px ${C_local.black}`,
              transform: "rotate(-1.5deg)",
            }}
          >
            ⭐ Featured
          </div>
        )}

        {/* Year badge */}
        {memory.year && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              border: `2px solid ${C_local.black}`,
              background: C_local.black,
              color: C_local.yellow,
              padding: "3px 8px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.04em",
            }}
          >
            {memory.year}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 14px 0", flex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            margin: "0 0 4px",
            color: C_local.onSurface,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            lineHeight: 1.3,
          }}
        >
          {memory.title}
        </h3>

        {/* Slug */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: C_local.textSecondary,
            margin: "0 0 8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          /{memory.slug}
        </p>

        {/* Location */}
        {memory.location && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: C_local.onSurfaceVariant,
              margin: "0 0 12px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>📍</span> {memory.location}
          </p>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderTop: `2px solid ${C_local.black}`,
          marginTop: "auto",
        }}
      >
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            border: "none",
            borderRight: `2px solid ${C_local.black}`,
            background: C_local.blue,
            color: C_local.black,
            padding: "10px 0",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#a8c8ff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = C_local.blue)
          }
        >
          ✏ Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          style={{
            flex: 1,
            border: "none",
            background: isDeleting ? C_local.surfaceAlt : C_local.pink,
            color: isDeleting ? C_local.textSecondary : C_local.black,
            padding: "10px 0",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            cursor: isDeleting ? "not-allowed" : "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => {
            if (!isDeleting) e.currentTarget.style.background = "#f0a0b0";
          }}
          onMouseLeave={(e) => {
            if (!isDeleting) e.currentTarget.style.background = C_local.pink;
          }}
        >
          {isDeleting ? "…" : "✕ Delete"}
        </button>
      </div>
    </div>
  );
}
