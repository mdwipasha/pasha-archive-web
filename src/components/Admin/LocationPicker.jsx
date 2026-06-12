import { useEffect, useRef, useState } from "react";

// ── Design tokens (matches MemoryForm + EditMemoryModal) ──────────────────────
const C = {
  black: "#1c1b1b",
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  outline: "#747878",
  yellow: "#FED74C",
  blue: "#BFD9FF",
  error: "#ffdad6",
  errorText: "#93000a",
  green: "#d4f7c5",
};

// ── Load Leaflet once from CDN (idempotent) ───────────────────────────────────
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) { resolve(window.L); return; }

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existing = document.getElementById("leaflet-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", () => reject(new Error("Leaflet load failed")));
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Could not load Leaflet. Check your internet connection."));
    document.head.appendChild(script);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LocationPicker({ lat, lng, onConfirm, onClose }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);

  const toStr = (v) => (v !== "" && v != null ? String(v) : "");
  const [currentLat, setCurrentLat] = useState(toStr(lat));
  const [currentLng, setCurrentLng] = useState(toStr(lng));
  const [status, setStatus] = useState(
    lat && lng ? "Pin placed — drag to adjust, or click elsewhere" : "Click the map to drop a pin"
  );
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Escape + body scroll lock
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Build pin icon (matches the neobrutalist style)
  function buildPinIcon(L) {
    return L.divIcon({
      html: `<div style="
        width:32px;height:32px;
        background:${C.yellow};
        border:3px solid ${C.black};
        box-shadow:3px 3px 0 ${C.black};
        display:flex;align-items:center;justify-content:center;
        font-size:16px;line-height:1;
        transform:translate(-50%,-100%);
        cursor:grab;
      ">📍</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      className: "",
    });
  }

  // Place or move the marker
  function placeMarker(L, latlng) {
    const { lat: pLat, lng: pLng } = latlng;
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      const marker = L.marker(latlng, { draggable: true, icon: buildPinIcon(L) })
        .addTo(mapRef.current);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setCurrentLat(pos.lat.toFixed(6));
        setCurrentLng(pos.lng.toFixed(6));
        setStatus("Dragged to new position");
      });
      markerRef.current = marker;
    }
    setCurrentLat(pLat.toFixed(6));
    setCurrentLng(pLng.toFixed(6));
  }

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    loadLeaflet()
      .then((L) => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Default center: Indonesia (user locale) or provided coords
        const initLat = lat !== "" && lat != null ? Number(lat) : -2.5;
        const initLng = lng !== "" && lng != null ? Number(lng) : 118.0;
        const initZoom = (lat !== "" && lat != null) ? 12 : 5;

        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([initLat, initLng], initZoom);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        // Restore existing coords
        if (lat !== "" && lat != null && lng !== "" && lng != null) {
          placeMarker(L, { lat: Number(lat), lng: Number(lng) });
        }

        // Click to drop/move pin
        map.on("click", (e) => {
          placeMarker(L, e.latlng);
          setStatus("Pin placed — drag to fine-tune");
        });
      })
      .catch((err) => {
        setMapError(err.message);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // GPS my location
  function handleGPS() {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setStatus("Requesting GPS access…");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: gLat, longitude: gLng } = pos.coords;
        const latlng = { lat: gLat, lng: gLng };

        if (mapRef.current) {
          mapRef.current.setView([gLat, gLng], 15);
          if (window.L) placeMarker(window.L, latlng);
        }
        setCurrentLat(gLat.toFixed(6));
        setCurrentLng(gLng.toFixed(6));
        setStatus("GPS location set — drag to adjust if needed");
        setLocating(false);
      },
      (err) => {
        setStatus(`GPS error: ${err.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  // Clear pin
  function handleClear() {
    if (markerRef.current && mapRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    setCurrentLat("");
    setCurrentLng("");
    setStatus("Pin cleared — click the map to set a new location");
  }

  function handleConfirm() {
    if (!currentLat || !currentLng) { setStatus("Drop a pin first."); return; }
    onConfirm(currentLat, currentLng);
    onClose();
  }

  const hasCoords = currentLat !== "" && currentLng !== "";

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.65)",
        zIndex: 10500,
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
          maxWidth: 720,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: C.black,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C.yellow,
            }}
          >
            Pick Location on Map
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "2px solid #444",
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
            onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
          >
            ✕
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `2px solid ${C.black}`,
            background: C.surfaceAlt,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleGPS}
            disabled={locating}
            style={{
              border: `2px solid ${C.black}`,
              background: C.blue,
              color: C.black,
              padding: "6px 14px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: locating ? "not-allowed" : "pointer",
              boxShadow: locating ? "none" : `2px 2px 0px ${C.black}`,
              opacity: locating ? 0.6 : 1,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {locating ? "⏳Locating…" : "My Location"}
          </button>

          {hasCoords && (
            <button
              onClick={handleClear}
              style={{
                border: `2px solid ${C.black}`,
                background: C.error,
                color: C.errorText,
                padding: "6px 14px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: `2px 2px 0px ${C.black}`,
                flexShrink: 0,
              }}
            >
              ✕ Clear
            </button>
          )}

          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C.outline,
              flex: 1,
              minWidth: 0,
            }}
          >
            {status}
          </span>

          {hasCoords && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 600,
                color: C.black,
                background: C.yellow,
                border: `2px solid ${C.black}`,
                padding: "4px 10px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {Number(currentLat).toFixed(4)}, {Number(currentLng).toFixed(4)}
            </span>
          )}
        </div>

        {/* ── Map or error ── */}
        {mapError ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.surfaceAlt,
              padding: 40,
            }}
          >
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                color: C.errorText,
                textAlign: "center",
                margin: 0,
              }}
            >
              ⚠ {mapError}
            </p>
          </div>
        ) : (
          <div
            ref={mapContainerRef}
            style={{ flex: 1, minHeight: 380 }}
          />
        )}

        {/* ── Footer ── */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: `2px solid ${C.black}`,
            background: C.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C.outline,
              margin: 0,
            }}
          >
            Click map to place · Drag pin to adjust · for GPS
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                border: `2px solid ${C.black}`,
                background: C.surface,
                color: C.black,
                padding: "8px 18px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasCoords}
              style={{
                border: `2px solid ${C.black}`,
                background: hasCoords ? C.yellow : C.surfaceAlt,
                color: C.black,
                padding: "8px 22px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: hasCoords ? "pointer" : "not-allowed",
                boxShadow: hasCoords ? `3px 3px 0px ${C.black}` : "none",
                opacity: hasCoords ? 1 : 0.5,
              }}
            >
              ✓ Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}