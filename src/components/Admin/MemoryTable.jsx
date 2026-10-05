import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getOptimizedImageUrl } from "../../lib/media";
import EditMemoryModal from "./EditMemoryModal";

const PAGE_SIZE = 12;
const C = { surface: "#FFFDF8", surfaceAlt: "#ECE6D8", black: "#1c1b1b", text: "#1c1b1b", muted: "#444748", outline: "#c4c7c7", yellow: "#FED74C", blue: "#BFD9FF", pink: "#F6D1D8" };

export default function MemoryTable({ refreshKey }) {
  const [memories, setMemories] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFilters = search.trim() || typeFilter !== "all" || featuredFilter !== "all" || visibilityFilter !== "all";

  async function loadMemories() {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const searchTerm = search.trim().replace(/[,%()]/g, " ");
    let query = supabase
      .from("memories")
      .select("id, title, slug, type, src, thumbnail_url, description, date, year, location, latitude, longitude, featured, visibility, cloudinary_public_id", { count: "exact" })
      .order("created_at", { ascending: false });
    if (searchTerm) query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    if (typeFilter !== "all") query = query.eq("type", typeFilter);
    if (featuredFilter !== "all") query = query.eq("featured", featuredFilter === "featured");
    if (visibilityFilter !== "all") query = query.eq("visibility", visibilityFilter);
    const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) {
      console.error(error);
      setMemories([]);
      setTotalCount(0);
    } else {
      setMemories(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  }

  async function deleteMemory(memory) {
    if (!confirm(`Delete "${memory.title}"?\n\nThis cannot be undone.`)) return;
    setDeletingId(memory.id);
    await fetch("/api/cloudinary/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId: memory.cloudinary_public_id, type: memory.type }) });
    const { error } = await supabase.from("memories").delete().eq("id", memory.id);
    if (error) console.error(error);
    setDeletingId(null);
    if (memories.length === 1 && page > 1) setPage((current) => current - 1);
    else loadMemories();
  }

  useEffect(() => { loadMemories(); }, [refreshKey, page, search, typeFilter, featuredFilter, visibilityFilter]);
  const updateFilter = (setter) => (event) => { setter(event.target.value); setPage(1); };
  const clearFilters = () => { setSearch(""); setTypeFilter("all"); setFeaturedFilter("all"); setVisibilityFilter("all"); setPage(1); };

  return <div>
    <div style={S.toolbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={S.count}>{totalCount}</div><span style={S.meta}>memories</span></div>
      <div style={S.filters}>
        <label style={S.search}><Icon name="search" size={15} /><input type="search" placeholder="Search title or location" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} style={S.searchInput} /></label>
        <select value={typeFilter} onChange={updateFilter(setTypeFilter)} style={S.select} aria-label="Filter by media type"><option value="all">All types</option><option value="Photo">Photos</option><option value="Video">Videos</option></select>
        <select value={featuredFilter} onChange={updateFilter(setFeaturedFilter)} style={S.select} aria-label="Filter by featured status"><option value="all">All status</option><option value="featured">Featured</option><option value="standard">Standard</option></select>
        <select value={visibilityFilter} onChange={updateFilter(setVisibilityFilter)} style={S.select} aria-label="Filter by visibility"><option value="all">All visibility</option><option value="public">Public</option><option value="private">Private</option></select>
        {hasFilters && <button onClick={clearFilters} style={S.clear}>Clear filters</button>}
      </div>
    </div>

    {loading && <div style={S.loading}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin .8s linear infinite" }} aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25" /><path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Loading</div>}
    {!loading && memories.length === 0 && <div style={S.empty}><Icon name="inbox" size={48} /><p style={S.emptyTitle}>No memories found</p>{hasFilters && <button onClick={clearFilters} style={S.clear}>Clear filters</button>}</div>}
    {!loading && memories.length > 0 && <>
      <div style={S.grid}>{memories.map((memory) => <MemoryCard key={memory.id} memory={memory} deletingId={deletingId} onEdit={() => setEditingMemory(memory)} onDelete={() => deleteMemory(memory)} />)}</div>
      <Pagination page={page} totalPages={totalPages} totalCount={totalCount} onPageChange={setPage} />
    </>}
    {editingMemory && <EditMemoryModal memory={editingMemory} onClose={() => setEditingMemory(null)} onSaved={loadMemories} />}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>;
}

function Pagination({ page, totalPages, totalCount, onPageChange }) {
  if (totalCount <= PAGE_SIZE) return null;
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, totalCount);
  return <nav aria-label="Memories pagination" style={S.pagination}>
    <span style={S.meta}>Showing {first}–{last} of {totalCount}</span>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} style={S.pageButton(page === 1)}>Previous</button>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={S.pageButton(page === totalPages)}>Next</button>
    </div>
  </nav>;
}

function MemoryCard({ memory, deletingId, onEdit, onDelete }) {
  const isDeleting = deletingId === memory.id;
  return <article style={S.card}>
    <div style={S.thumb}>
      <img src={getOptimizedImageUrl(memory.type === "Video" ? memory.thumbnail_url : memory.src, { width: 640, height: 400 })} alt={memory.title} loading="lazy" decoding="async" style={S.image} />
      {memory.type === "Video" && <span style={S.play}><Icon name="play" size={20} /></span>}
      {memory.featured && <span style={S.featured}><Icon name="star" size={12} /> Featured</span>}
      {memory.visibility === "private" && <span style={S.private}>Private</span>}
      {memory.year && <span style={S.year}>{memory.year}</span>}
    </div>
    <div style={{ padding: "14px 14px 0", flex: 1 }}><h3 style={S.title}>{memory.title}</h3><p style={S.slug}>/{memory.slug}</p>{memory.location && <p style={S.location}><Icon name="pin" size={13} />{memory.location}</p>}</div>
    <div style={S.actions}><button onClick={onEdit} style={S.edit}><Icon name="edit" size={14} />Edit</button><button onClick={onDelete} disabled={isDeleting} style={S.delete(isDeleting)}>{isDeleting ? "Deleting" : <><Icon name="trash" size={14} />Delete</>}</button></div>
  </article>;
}

function Icon({ name, size = 16 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    inbox: <><path d="M4 4h16v13H4z" /><path d="M4 12h4l2 3h4l2-3h4" /></>,
    pin: <><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    play: <path d="m9 7 7 5-7 5Z" fill="currentColor" stroke="none" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
    edit: <><path d="m4 20 4.2-1 10-10a2.1 2.1 0 0 0-3-3l-10 10Z" /><path d="m13.5 7.5 3 3" /></>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>{paths[name]}</svg>;
}

const S = {
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${C.outline}` },
  filters: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }, count: { border: `2px solid ${C.black}`, background: C.yellow, padding: "4px 12px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, boxShadow: `2px 2px 0 ${C.black}` }, meta: { fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: C.muted },
  search: { display: "flex", alignItems: "center", gap: 7, border: `2px solid ${C.black}`, background: C.surfaceAlt, padding: "0 10px", color: C.muted }, searchInput: { border: "none", background: "transparent", padding: "8px 0", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: C.text, outline: "none", width: 190 }, select: { border: `2px solid ${C.black}`, background: C.surfaceAlt, padding: "8px 9px", fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: C.text, cursor: "pointer" }, clear: { border: `2px solid ${C.black}`, background: C.surface, padding: "8px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: "pointer" },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12, color: C.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: ".07em" }, empty: { border: `3px dashed ${C.outline}`, padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: C.surfaceAlt, color: C.muted }, emptyTitle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: ".05em", color: C.text, margin: 0 }, grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 28, paddingTop: 18, borderTop: `2px solid ${C.outline}` }, pageButton: (disabled) => ({ border: `2px solid ${C.black}`, background: disabled ? C.surfaceAlt : C.yellow, padding: "7px 10px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .55 : 1 }),
  card: { border: `3px solid ${C.black}`, background: C.surface, boxShadow: `5px 5px 0 ${C.black}`, overflow: "hidden", display: "flex", flexDirection: "column" }, thumb: { position: "relative", height: 160, borderBottom: `3px solid ${C.black}`, background: C.surfaceAlt, overflow: "hidden", flexShrink: 0 }, image: { width: "100%", height: "100%", objectFit: "cover", display: "block" }, play: { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: C.surface, background: "rgba(0,0,0,.25)" }, featured: { position: "absolute", top: 8, left: 8, display: "inline-flex", alignItems: "center", gap: 4, border: `2px solid ${C.black}`, background: C.yellow, padding: "3px 8px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em", boxShadow: `2px 2px 0 ${C.black}`, transform: "rotate(-1.5deg)" }, private: { position: "absolute", bottom: 8, left: 8, border: `2px solid ${C.black}`, background: C.pink, padding: "3px 8px", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }, year: { position: "absolute", top: 8, right: 8, border: `2px solid ${C.black}`, background: C.black, color: C.yellow, padding: "3px 8px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 10 },
  title: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, margin: "0 0 4px", color: C.text, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 1, lineHeight: 1.3 }, slug: { fontFamily: "monospace", fontSize: 10, color: C.muted, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, location: { fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: C.muted, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }, actions: { display: "flex", borderTop: `2px solid ${C.black}`, marginTop: "auto" }, edit: { flex: 1, border: "none", borderRight: `2px solid ${C.black}`, background: C.blue, color: C.black, padding: "10px 0", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }, delete: (disabled) => ({ flex: 1, border: "none", background: disabled ? C.surfaceAlt : C.pink, color: disabled ? C.muted : C.black, padding: "10px 0", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11, textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }),
};
