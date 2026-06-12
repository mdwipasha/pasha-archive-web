import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabase";

/* ─── Config ─── */
const ZOOM_THRESHOLD = 9; // below = city clusters, at/above = individual photo pins

const ACCENTS = [
  "#BFD9FF",
  "#F6D1D8",
  "#FDE68A",
  "#C7F9CC",
  "#DDD6FE",
  "#FED7AA",
  "#FBCFE8",
  "#A7F3D0",
];

const TAPE_COLORS = [
  "rgba(255,225,77,.8)",
  "rgba(255,107,157,.7)",
  "rgba(125,211,252,.7)",
];

/* ─── City cluster marker ─── */
function makeCityIcon(city, count, color, active) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        background:${active ? color : "#fff"};
        border:3px solid #000;
        padding:10px 14px 8px;
        width:full;
        text-align:center;
        box-shadow:${active ? "2px 2px 0 #000" : "5px 5px 0 #000"};
        transform:${active ? "translate(3px,3px)" : "none"};
        cursor:pointer;
        font-family:'Space Grotesk',sans-serif;
      ">
        <div style="font-size:18px;line-height:1">
        <span class="material-symbols-outlined">photo_camera_back</span></div>
        <div style="font-weight:900;font-size:10px;margin-top:4px;color:#000;letter-spacing:.5px;text-transform:uppercase">${city}</div>
        <div style="
          position:absolute;top:-11px;right:-11px;
          background:#000;color:${color};
          font-weight:900;font-size:11px;
          width:24px;height:24px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          border:2px solid #000;font-family:'Space Grotesk',sans-serif;
        ">${count}</div>
      </div>`,
    iconSize: [92, 66],
    iconAnchor: [46, 33],
  });
}

/* ─── Individual photo pin marker ─── */
function makeMemoryIcon(memory, color, count = 1) {
  // Clamp title to ~16 chars so the pin stays small
  const label =
    memory.title.length > 16 ? memory.title.slice(0, 14) + "…" : memory.title;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        background:#fff;
        border:2.5px solid #000;
        box-shadow:3px 3px 0 #000;
        width:68px;
        cursor:pointer;
        font-family:'Space Grotesk',sans-serif;
      ">
        <div style="
          position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(-1.5deg);
          width:32px;height:14px;
          background:${color};
          border:1.5px solid rgba(0,0,0,.2);
          z-index:2;
        "></div>
        ${count > 1
        ? `
          <div style="
            position:absolute;top:-10px;right:-10px;
            background:#000;color:${color};
            font-weight:900;font-size:11px;
            width:22px;height:22px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            border:2px solid #000;z-index:10;
          ">${count}</div>
        `
        : ""
      }
        <img
          src="${memory.type === "Video" ? memory.thumbnail_url : memory.image}"
          style="width:100%;height:52px;object-fit:cover;display:block;border-bottom:2px solid #000;"
        />
        <div style="
          padding:4px 5px 5px;
          font-weight:800;font-size:9px;
          line-height:1.3;color:#000;
          text-transform:uppercase;
          background:#fff;
        ">${label}</div>
        <div style="
          position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:9px solid #000;
        "></div>
      </div>`,
    iconSize: [70, 82],
    iconAnchor: [35, 82],
  });
}

/* ─── Combined map controller (fly-to + zoom watcher) ─── */
function MapController({ flyTarget, onZoomChange }) {
  const map = useMap();
  const prevKey = useRef(null);

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useEffect(() => {
    if (!flyTarget) return;
    const key = `${flyTarget[0]},${flyTarget[1]},${flyTarget[2]}`;
    if (key === prevKey.current) return;
    prevKey.current = key;
    map.flyTo([flyTarget[0], flyTarget[1]], flyTarget[2], { duration: 1.1 });
  }, [flyTarget, map]);

  return null;
}

/* ─── Zoom level badge (shown inside the map) ─── */
function ZoomBadge({ zoom }) {
  const isClustered = zoom < ZOOM_THRESHOLD;
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 999,
        background: isClustered ? "#000" : "#FFE14D",
        color: isClustered ? "#fff" : "#000",
        border: "2.5px solid #000",
        boxShadow: "3px 3px 0 #000",
        padding: "6px 12px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: ".5px",
        pointerEvents: "none",
        transition: "background .2s, color .2s",
      }}
    >
      {isClustered ? `ZOOM IN TO SPREAD PINS` : `SHOWING INDIVIDUAL PINS`}
    </div>
  );
}

/* ─── Polaroid card (used in the side panel) ─── */
function MemoryCard({ memory, index, accent, onClick }) {
  const rotations = [-2, 1.5, -1, 2, -1.5, 1];
  const rot = rotations[index % rotations.length];
  const tape = TAPE_COLORS[index % TAPE_COLORS.length];

  return (
    <div
      onClick={() => onClick(memory)}
      style={{
        position: "relative",
        background: "#fff",
        border: "2.5px solid #000",
        boxShadow: "4px 4px 0 #000",
        transform: `rotate(${rot}deg)`,
        cursor: "pointer",
        transition: "transform .15s, box-shadow .15s",
        overflow: "visible",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.04)";
        e.currentTarget.style.boxShadow = "6px 6px 0 #000";
        e.currentTarget.style.zIndex = 10;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rot}deg)`;
        e.currentTarget.style.boxShadow = "4px 4px 0 #000";
        e.currentTarget.style.zIndex = 1;
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 38,
          height: 16,
          background: tape,
          border: "1.5px solid rgba(0,0,0,.15)",
          zIndex: 2,
        }}
      />
      <img
        src={memory.type === "Video" ? memory.thumbnail_url : memory.image}
        alt={memory.title}
        style={{
          width: "100%",
          height: 100,
          objectFit: "cover",
          display: "block",
          borderBottom: "2px solid #000",
        }}
      />
      <div style={{ padding: "8px 10px 10px", background: "#fff" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: ".5px",
            textTransform: "uppercase",
            color: "#000",
            lineHeight: 1.3,
          }}
        >
          {memory.title}
        </div>
        {memory.year && (
          <div
            style={{
              marginTop: 4,
              display: "inline-block",
              background: accent,
              border: "1.5px solid #000",
              padding: "1px 6px",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {memory.year}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ memory, city, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.88)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          border: "4px solid #000",
          boxShadow: "10px 10px 0 #000",
          maxWidth: 540,
          width: "100%",
          overflow: "hidden",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {memory.type === "Video" ? (
          <video
            src={memory.src}
            controls
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxHeight: 380,
              objectFit: "contain",
              display: "block",
              background: "#000",
              borderBottom: "3px solid #000",
            }}
          />
        ) : (
          <img
            src={memory.image}
            alt={memory.title}
            style={{
              width: "100%",
              maxHeight: 380,
              objectFit: "cover",
              display: "block",
              borderBottom: "3px solid #000",
            }}
          />
        )}
        <div
          style={{
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 20,
                color: "#000",
                lineHeight: 1.2,
              }}
            >
              {memory.title}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: city.color,
                  border: "2px solid #000",
                  padding: "2px 10px",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {city.city}
              </span>
              {memory.year && (
                <span
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "2px 10px",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {memory.year}
                </span>
              )}
              <span
                style={{
                  background: "#f4f4f5",
                  border: "2px solid #000",
                  padding: "2px 10px",
                  fontWeight: 700,
                  fontSize: 11,
                  color: "#555",
                }}
              >
                {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: ".5px",
              fontFamily: "'Space Grotesk', sans-serif",
              flexShrink: 0,
            }}
          >
            ✕ CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Side panel ─── */
function GalleryPanel({
  selectedCity,
  selectedLocationGroup,
  onClose,
  onMemoryClick,
  onShowAllInCity,
}) {
  const visible = !!selectedCity;

  const memoriesToDisplay = selectedLocationGroup
    ? selectedLocationGroup.memories
    : selectedCity?.memories || [];

  const title = selectedLocationGroup
    ? `Spot in ${selectedCity?.city || ""}`
    : selectedCity?.city || "";

  const subtitle = selectedLocationGroup
    ? `${selectedLocationGroup.memories.length} memories at this spot`
    : `${selectedCity?.memories.length || 0} memories collected`;

  const color = selectedCity?.color || "#fff";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 320,
        height: "100%",
        background: "#FAFAF8",
        borderLeft: "3px solid #000",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform .28s cubic-bezier(.4,0,.2,1)",
        overflowY: "auto",
      }}
    >
      {selectedCity && (
        <>
          {/* Header */}
          <div
            style={{
              background: color,
              borderBottom: "3px solid #000",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "sticky",
              top: 0,
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 18,
                  color: "#000",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#000",
                  marginTop: 3,
                  opacity: 0.7,
                }}
              >
                {subtitle}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#000",
                color: "#fff",
                border: "none",
                width: 32,
                height: 32,
                fontWeight: 900,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ✕
            </button>
          </div>

          {/* Show All in City Button */}
          {selectedLocationGroup && (
            <button
              onClick={onShowAllInCity}
              style={{
                background: "#000",
                color: color,
                border: "2.5px solid #000",
                padding: "8px 12px",
                fontWeight: 900,
                fontSize: 11,
                cursor: "pointer",
                margin: "12px 16px 0",
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: "uppercase",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
                textAlign: "center",
              }}
            >
              Show All in {selectedCity.city}
            </button>
          )}

          {/* Label */}
          <div
            style={{
              padding: "12px 16px 4px",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#71717a",
              borderBottom: "1.5px solid #e4e4e7",
            }}
          >
            Gallery — click to expand
          </div>

          {/* Grid */}
          <div
            style={{
              padding: "20px 16px 24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              overflowY: "auto",
              flex: 1,
            }}
          >
            {memoriesToDisplay.map((memory, i) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                index={i}
                accent={color}
                onClick={onMemoryClick}
              />
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "2px solid #000",
              padding: "10px 16px",
              background: "#000",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: ".5px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {selectedLocationGroup ? (
              <>
                {selectedLocationGroup.latitude.toFixed(4)}°,&nbsp;
                {selectedLocationGroup.longitude.toFixed(4)}°
              </>
            ) : (
              <>
                {selectedCity.latitude.toFixed(4)}°,&nbsp;
                {selectedCity.longitude.toFixed(4)}°
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════ */
export default function MemoriesMap() {
  const [memories, setMemories] = useState([]);
  const [zoom, setZoom] = useState(5);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocationGroup, setSelectedLocationGroup] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null); // [lat, lng, zoomLevel]
  const [panelOpen, setPanelOpen] = useState(false);

  const isClustered = zoom < ZOOM_THRESHOLD;

  const cityGroups = useMemo(() => {
    const map = {};
    let idx = 0;

    memories.forEach((m) => {
      if (!m.latitude || !m.longitude) return;

      if (!map[m.city]) {
        map[m.city] = {
          city: m.city,
          color: ACCENTS[idx++ % ACCENTS.length],
          memories: [],
        };
      }

      map[m.city].memories.push(m);
    });

    return Object.values(map).map((cg) => ({
      ...cg,
      latitude:
        cg.memories.reduce((sum, m) => sum + m.latitude, 0) /
        cg.memories.length,
      longitude:
        cg.memories.reduce((sum, m) => sum + m.longitude, 0) /
        cg.memories.length,
    }));
  }, [memories]);

  const locationGroups = useMemo(() => {
    const map = {};

    memories.forEach((m) => {
      const key = `${m.latitude}-${m.longitude}`;

      if (!map[key]) {
        map[key] = {
          latitude: m.latitude,
          longitude: m.longitude,
          memories: [],
        };
      }

      map[key].memories.push(m);
    });

    return Object.values(map);
  }, [memories]);

  const cityByName = useMemo(
    () => Object.fromEntries(cityGroups.map((cg) => [cg.city, cg])),
    [cityGroups],
  );

  async function fetchMemories() {
    const { data, error } = await supabase.from("memories").select(`
        id,
        title,
        location,
        src,
        type,
        thumbnail_url,
        latitude,
        longitude,
        year,
        date
      `);

    console.log("ERROR:", error);
    console.log("DATA:", data);

    if (error) {
      console.error(error);
      return;
    }

    setMemories(
      data
        .filter((item) => item.latitude !== null && item.longitude !== null)
        .map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          src: item.src,
          city: item.location,
          thumbnail_url: item.thumbnail_url,
          image: item.type === "Video" ? item.thumbnail_url : item.src,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          year: item.year,
          date: item.date,
        })),
    );
  }

  const openCity = (cg, targetZoom = 11) => {
    if (selectedCity?.city === cg.city && panelOpen && !selectedLocationGroup) {
      // second click → close
      setPanelOpen(false);
      setTimeout(() => {
        setSelectedCity(null);
        setSelectedLocationGroup(null);
      }, 280);
    } else {
      setSelectedCity(cg);
      setSelectedLocationGroup(null);
      setPanelOpen(true);
      setFlyTarget([cg.latitude, cg.longitude, targetZoom]);
    }
    setSelectedMemory(null);
  };

  const handleCityMarkerClick = (cg) => openCity(cg, ZOOM_THRESHOLD + 2);

  const handleLocationMarkerClick = (group) => {
    const firstMemory = group.memories[0];
    const cg = cityByName[firstMemory.city];
    setSelectedCity(cg);
    setSelectedLocationGroup(group);
    setPanelOpen(true);

    if (group.memories.length === 1) {
      setSelectedMemory(firstMemory);
    } else {
      setSelectedMemory(null);
    }
  };

  const handleClose = () => {
    setPanelOpen(false);
    setTimeout(() => {
      setSelectedCity(null);
      setSelectedLocationGroup(null);
      setSelectedMemory(null);
    }, 280);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("memories-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memories",
        },
        () => {
          fetchMemories();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      className="space-y-5 px-6 md:px-16 py-16 md:py-24"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-5 border-b-2 border-black pb-4">
        <h2 class="text-4xl md:text-5xl font-black uppercase tracking-[-0.03em]">
          Map Memories
        </h2>
        {/* City stat pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cityGroups.map((cg) => (
            <div
              key={cg.city}
              style={{
                background: cg.color,
                border: "2.5px solid #000",
                padding: "4px 12px",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: ".3px",
                boxShadow: "3px 3px 0 #000",
              }}
            >
              {cg.memories.length}× {cg.city}
            </div>
          ))}
        </div>
      </div>
      <p
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: "#71717a",
        }}
      >
        {memories.length} memories &nbsp;·&nbsp; {cityGroups.length} cities
      </p>

      {/* ── City filter pills ── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleClose}
          style={{
            background: !selectedCity ? "#000" : "#fff",
            color: !selectedCity ? "#fff" : "#000",
            border: "2.5px solid #000",
            padding: "6px 16px",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: !selectedCity ? "none" : "3px 3px 0 #000",
            transform: !selectedCity ? "translate(3px,3px)" : "none",
            transition: "all .12s",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ALL
        </button>

        {cityGroups.map((cg) => {
          const active = selectedCity?.city === cg.city && panelOpen;
          return (
            <button
              key={cg.city}
              onClick={() => openCity(cg)}
              style={{
                background: active ? cg.color : "#fff",
                color: "#000",
                border: "2.5px solid #000",
                padding: "6px 16px",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: active ? "none" : "3px 3px 0 #000",
                transform: active ? "translate(3px,3px)" : "none",
                transition: "all .12s",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {cg.city}
              <span
                style={{
                  color: active ? "#000" : cg.color,
                  fontSize: 16,
                  fontWeight: 900,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cg.memories.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Map ── */}
      <div
        style={{
          position: "relative",
          border: "3px solid #000",
          boxShadow: "6px 6px 0 #000",
          overflow: "hidden",
          height: 600,
        }}
      >
        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <MapController flyTarget={flyTarget} onZoomChange={setZoom} />

          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* City cluster markers — visible when zoomed out */}
          {isClustered &&
            cityGroups.map((cg) => (
              <Marker
                key={`city-${cg.city}`}
                position={[cg.latitude, cg.longitude]}
                icon={makeCityIcon(
                  cg.city,
                  cg.memories.length,
                  cg.color,
                  selectedCity?.city === cg.city && panelOpen,
                )}
                eventHandlers={{ click: () => handleCityMarkerClick(cg) }}
              />
            ))}

          {/* Individual photo markers — visible when zoomed in */}
          {!isClustered &&
            locationGroups.map((group) => {
              const firstMemory = group.memories[0];
              const cg = cityByName[firstMemory.city];
              if (!cg) return null;
              const count = group.memories.length;
              return (
                <Marker
                  key={`loc-${group.latitude}-${group.longitude}`}
                  position={[group.latitude, group.longitude]}
                  icon={makeMemoryIcon(firstMemory, cg.color, count)}
                  eventHandlers={{
                    click: () => handleLocationMarkerClick(group),
                  }}
                />
              );
            })}
        </MapContainer>

        {/* Zoom state badge */}
        <ZoomBadge zoom={zoom} />

        {/* "No city selected" hint */}
        {!panelOpen && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 500,
              background: "#fff",
              border: "2.5px solid #000",
              boxShadow: "4px 4px 0 #000",
              padding: "8px 18px",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: ".5px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {isClustered
              ? "Click a city marker to open gallery"
              : "Click a photo pin to view memory"}
          </div>
        )}

        {/* Gallery side panel */}
        <GalleryPanel
          selectedCity={selectedCity}
          selectedLocationGroup={selectedLocationGroup}
          onClose={handleClose}
          onMemoryClick={setSelectedMemory}
          onShowAllInCity={() => setSelectedLocationGroup(null)}
        />
      </div>

      {/* ── Lightbox ── */}
      {selectedMemory && selectedCity && (
        <Lightbox
          memory={selectedMemory}
          city={selectedCity}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </section>
  );
}
