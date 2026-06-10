import { useMemo, useState } from "react";
import GalleryCard from "./GalleryCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  return (memory.people || [])
    .map((person) =>
      person && typeof person === "object" ? person.name : String(person || ""),
    )
    .filter(Boolean);
};

const ROTATIONS = [
  "rotate-[1deg]",
  "-rotate-2",
  "rotate-[0.5deg]",
  "-rotate-[1deg]",
  "rotate-[2deg]",
  "-rotate-[0.5deg]",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterGroup({ label, options, selected, onToggle, accent }) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2.5 opacity-40">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`border-2 border-black px-3 py-1.5 text-xs uppercase tracking-[0.12em] font-bold transition-all duration-150 ${
                active
                  ? `${accent} shadow-none translate-x-[2px] translate-y-[2px]`
                  : "bg-white text-black shadow-[2px_2px_0_rgb(0,0,0)] hover:bg-[#f3efe6]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 border-2 border-black bg-[#FFFDF8] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-[2px_2px_0_rgb(0,0,0)]">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 text-base font-black leading-none hover:opacity-50 transition-opacity"
        aria-label={`Remove filter ${label}`}
      >
        ×
      </button>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GallerySection({ memories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // ── Derived filter options ──────────────────────────────────────────────────

  const filterOptions = useMemo(() => {
    const tags = [...new Set(memories.flatMap((m) => m.tags || []))].sort();
    const years = [
      ...new Set(memories.map(getMemoryYear).filter(Boolean)),
    ].sort((a, b) => Number(b) - Number(a));
    const locations = [
      ...new Set(memories.map((m) => m.location).filter(Boolean)),
    ].sort();
    const people = [...new Set(memories.flatMap(getMemoryPersonNames))].sort();
    return { tags, years, locations, people };
  }, [memories]);

  // ── Sorted + filtered memories ─────────────────────────────────────────────

  const sortedMemories = useMemo(
    () =>
      [...memories].sort(
        (a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a),
      ),
    [memories],
  );

  const filteredMemories = useMemo(() => {
    return sortedMemories.filter((memory) => {
      // Full-text search (title + description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          (memory.title || "").toLowerCase().includes(q) ||
          (memory.description || "").toLowerCase().includes(q);
        if (!hit) return false;
      }

      // Tags — OR within group
      if (selectedTags.length > 0) {
        if (!selectedTags.some((t) => (memory.tags || []).includes(t)))
          return false;
      }

      // Year — OR within group
      if (selectedYears.length > 0) {
        if (!selectedYears.includes(getMemoryYear(memory))) return false;
      }

      // Location — OR within group
      if (selectedLocations.length > 0) {
        if (!selectedLocations.includes(memory.location)) return false;
      }

      // People — OR within group
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
    selectedPeople,
  ]);

  const visibleMemories = filteredMemories.slice(0, visibleCount);

  // ── Filter helpers ─────────────────────────────────────────────────────────

  const makeToggler = (setter) => (value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
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

  // ── Active state derived values ────────────────────────────────────────────

  const totalActiveFilters =
    selectedTags.length +
    selectedYears.length +
    selectedLocations.length +
    selectedPeople.length;

  const hasActiveFilters = !!searchQuery.trim() || totalActiveFilters > 0;

  const activeChips = [
    ...selectedTags.map((v) => ({
      label: `# ${v}`,
      onRemove: () => toggleTag(v),
    })),
    ...selectedYears.map((v) => ({
      label: `📅 ${v}`,
      onRemove: () => toggleYear(v),
    })),
    ...selectedLocations.map((v) => ({
      label: `📍 ${v}`,
      onRemove: () => toggleLocation(v),
    })),
    ...selectedPeople.map((v) => ({
      label: `👤 ${v}`,
      onRemove: () => togglePerson(v),
    })),
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Search bar + filter toggle ── */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-30 pointer-events-none select-none">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            }}
            placeholder="Search by title or description…"
            className="w-full border-2 border-black bg-[#FFFDF8] pl-9 pr-9 py-3 font-bold text-sm placeholder:font-normal placeholder:opacity-35 shadow-[3px_3px_0_rgb(0,0,0)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-black leading-none opacity-40 hover:opacity-80 transition-opacity"
            >
              ×
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 border-2 border-black px-5 py-3 uppercase tracking-[0.15em] text-sm font-black transition-all duration-150 whitespace-nowrap ${
            showFilters || totalActiveFilters > 0
              ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-[#FFFDF8] text-black shadow-[3px_3px_0_rgb(0,0,0)] hover:bg-[#f3efe6]"
          }`}
        >
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span className="border border-current text-[10px] font-black px-1.5 py-0.5 leading-none bg-[#FFD700] text-black border-black">
              {totalActiveFilters}
            </span>
          )}
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="border-2 border-black bg-[#FFFDF8] p-5 mb-5 shadow-[4px_4px_0_rgb(0,0,0)] flex flex-col gap-5">
          <FilterGroup
            label="Tags"
            options={filterOptions.tags}
            selected={selectedTags}
            onToggle={toggleTag}
            accent="bg-[#FFD700]"
          />
          <FilterGroup
            label="Year"
            options={filterOptions.years}
            selected={selectedYears}
            onToggle={toggleYear}
            accent="bg-[#a8e6cf]"
          />
          <FilterGroup
            label="Location"
            options={filterOptions.locations}
            selected={selectedLocations}
            onToggle={toggleLocation}
            accent="bg-[#ffb3c6]"
          />
          <FilterGroup
            label="People"
            options={filterOptions.people}
            selected={selectedPeople}
            onToggle={togglePerson}
            accent="bg-[#b3d4ff]"
          />

          {totalActiveFilters > 0 && (
            <div className="pt-3 border-t-2 border-black border-dashed">
              <button
                onClick={clearAll}
                className="border-2 border-black bg-black text-white px-4 py-1.5 text-xs font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {searchQuery.trim() && (
            <ActiveChip
              label={`"${searchQuery}"`}
              onRemove={() => setSearchQuery("")}
            />
          )}
          {activeChips.map(({ label, onRemove }) => (
            <ActiveChip key={label} label={label} onRemove={onRemove} />
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="border-2 border-black bg-black text-white px-3 py-1 text-[11px] font-black uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Results count ── */}
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-35 mb-10">
        {filteredMemories.length === memories.length
          ? `${memories.length} memories`
          : `${filteredMemories.length} of ${memories.length} memories`}
      </p>

      {/* ── Masonry grid ── */}
      {visibleMemories.length > 0 ? (
        <div className="masonry-grid w-full">
          {visibleMemories.map((memory, index) => (
            <div
              key={memory.id}
              className={`masonry-item relative ${ROTATIONS[index % 6]}`}
            >
              <GalleryCard memory={memory} index={index} client:load />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-black bg-[#FFFDF8] py-20 text-center shadow-[4px_4px_0_rgb(0,0,0)]">
          <div className="text-5xl mb-4">🗂️</div>
          <p className="font-black uppercase tracking-[0.2em] text-base mb-1">
            No memories found
          </p>
          <p className="text-sm opacity-40 mb-6">
            Try adjusting your filters or search
          </p>
          <button
            onClick={clearAll}
            className="border-2 border-black bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Load more ── */}
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
