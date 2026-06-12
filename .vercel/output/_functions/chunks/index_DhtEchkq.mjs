import { c as createComponent } from './astro-component_DqjkGFZ6.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate } from './entrypoint_CaXNZmEO.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_k0mJAHN5.mjs';
import { useRef, useState, useEffect } from 'react';
import { s as supabase } from './supabase_DGD5oBn6.mjs';

async function uploadToCloudinary(file, folder, year) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    "pasha_archive"
  );
  if (folder) {
    formData.append("folder", folder);
  }
  const cloudName = "dfluo0iya";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }
  return data;
}

const C$3 = {
  black: "#1c1b1b",
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  outline: "#747878",
  yellow: "#FED74C",
  blue: "#BFD9FF",
  error: "#ffdad6",
  errorText: "#93000a"};
function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
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
function LocationPicker({ lat, lng, onConfirm, onClose }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);
  const toStr = (v) => v !== "" && v != null ? String(v) : "";
  const [currentLat, setCurrentLat] = useState(toStr(lat));
  const [currentLng, setCurrentLng] = useState(toStr(lng));
  const [status, setStatus] = useState(
    lat && lng ? "Pin placed — drag to adjust, or click elsewhere" : "Click the map to drop a pin"
  );
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  function buildPinIcon(L) {
    return L.divIcon({
      html: `<div style="
        width:32px;height:32px;
        background:${C$3.yellow};
        border:3px solid ${C$3.black};
        box-shadow:3px 3px 0 ${C$3.black};
        display:flex;align-items:center;justify-content:center;
        font-size:16px;line-height:1;
        transform:translate(-50%,-100%);
        cursor:grab;
      ">📍</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      className: ""
    });
  }
  function placeMarker(L, latlng) {
    const { lat: pLat, lng: pLng } = latlng;
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      const marker = L.marker(latlng, { draggable: true, icon: buildPinIcon(L) }).addTo(mapRef.current);
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
  useEffect(() => {
    if (!mapContainerRef.current) return;
    loadLeaflet().then((L) => {
      if (!mapContainerRef.current || mapRef.current) return;
      const initLat = lat !== "" && lat != null ? Number(lat) : -2.5;
      const initLng = lng !== "" && lng != null ? Number(lng) : 118;
      const initZoom = lat !== "" && lat != null ? 12 : 5;
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([initLat, initLng], initZoom);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19
      }).addTo(map);
      if (lat !== "" && lat != null && lng !== "" && lng != null) {
        placeMarker(L, { lat: Number(lat), lng: Number(lng) });
      }
      map.on("click", (e) => {
        placeMarker(L, e.latlng);
        setStatus("Pin placed — drag to fine-tune");
      });
    }).catch((err) => {
      setMapError(err.message);
    });
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);
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
      { enableHighAccuracy: true, timeout: 12e3 }
    );
  }
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
    if (!currentLat || !currentLng) {
      setStatus("Drop a pin first.");
      return;
    }
    onConfirm(currentLat, currentLng);
    onClose();
  }
  const hasCoords = currentLat !== "" && currentLng !== "";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: overlayRef,
      onClick: (e) => {
        if (e.target === overlayRef.current) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.65)",
        zIndex: 10500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          background: C$3.surface,
          border: `3px solid ${C$3.black}`,
          boxShadow: `10px 10px 0px ${C$3.black}`,
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            background: C$3.black,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0
          }
        },
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C$3.yellow
            }
          },
          "Pick Location on Map"
        ),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            style: {
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
              lineHeight: 1
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "#333";
              e.currentTarget.style.color = "#fff";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#aaa";
            }
          },
          "✕"
        )
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            padding: "10px 14px",
            borderBottom: `2px solid ${C$3.black}`,
            background: C$3.surfaceAlt,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            flexShrink: 0
          }
        },
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleGPS,
            disabled: locating,
            style: {
              border: `2px solid ${C$3.black}`,
              background: C$3.blue,
              color: C$3.black,
              padding: "6px 14px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: locating ? "not-allowed" : "pointer",
              boxShadow: locating ? "none" : `2px 2px 0px ${C$3.black}`,
              opacity: locating ? 0.6 : 1,
              flexShrink: 0,
              whiteSpace: "nowrap"
            }
          },
          locating ? "⏳Locating…" : "My Location"
        ),
        hasCoords && /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleClear,
            style: {
              border: `2px solid ${C$3.black}`,
              background: C$3.error,
              color: C$3.errorText,
              padding: "6px 14px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
              boxShadow: `2px 2px 0px ${C$3.black}`,
              flexShrink: 0
            }
          },
          "✕ Clear"
        ),
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C$3.outline,
              flex: 1,
              minWidth: 0
            }
          },
          status
        ),
        hasCoords && /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 600,
              color: C$3.black,
              background: C$3.yellow,
              border: `2px solid ${C$3.black}`,
              padding: "4px 10px",
              flexShrink: 0,
              whiteSpace: "nowrap"
            }
          },
          Number(currentLat).toFixed(4),
          ", ",
          Number(currentLng).toFixed(4)
        )
      ),
      mapError ? /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: C$3.surfaceAlt,
            padding: 40
          }
        },
        /* @__PURE__ */ React.createElement(
          "p",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              color: C$3.errorText,
              textAlign: "center",
              margin: 0
            }
          },
          "⚠ ",
          mapError
        )
      ) : /* @__PURE__ */ React.createElement(
        "div",
        {
          ref: mapContainerRef,
          style: { flex: 1, minHeight: 380 }
        }
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            padding: "12px 18px",
            borderTop: `2px solid ${C$3.black}`,
            background: C$3.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexShrink: 0
          }
        },
        /* @__PURE__ */ React.createElement(
          "p",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C$3.outline,
              margin: 0
            }
          },
          "Click map to place · Drag pin to adjust · for GPS"
        ),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            style: {
              border: `2px solid ${C$3.black}`,
              background: C$3.surface,
              color: C$3.black,
              padding: "8px 18px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer"
            }
          },
          "Cancel"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleConfirm,
            disabled: !hasCoords,
            style: {
              border: `2px solid ${C$3.black}`,
              background: hasCoords ? C$3.yellow : C$3.surfaceAlt,
              color: C$3.black,
              padding: "8px 22px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: hasCoords ? "pointer" : "not-allowed",
              boxShadow: hasCoords ? `3px 3px 0px ${C$3.black}` : "none",
              opacity: hasCoords ? 1 : 0.5
            }
          },
          "✓ Confirm Location"
        ))
      )
    )
  );
}

const C$2 = {
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
  error: "#ffdad6",
  errorText: "#93000a",
  green: "#d4f7c5"
};
const inputStyle = {
  width: "100%",
  border: `2px solid ${C$2.black}`,
  background: C$2.surfaceAlt,
  padding: "10px 14px",
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: C$2.onSurface,
  outline: "none",
  boxShadow: `3px 3px 0px ${C$2.black}`,
  transition: "all 0.12s ease",
  boxSizing: "border-box"
};
const labelStyle = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: C$2.onSurfaceVariant,
  marginBottom: 6
};
const focusIn = (e) => {
  e.target.style.background = C$2.surface;
  e.target.style.boxShadow = "none";
  e.target.style.transform = "translate(2px,2px)";
};
const focusOut = (e) => {
  e.target.style.background = C$2.surfaceAlt;
  e.target.style.boxShadow = `3px 3px 0px ${C$2.black}`;
  e.target.style.transform = "none";
};
function ManageModal({
  open,
  onClose,
  tags,
  people,
  onTagsChange,
  onPeopleChange
}) {
  const [tab, setTab] = useState("people");
  const [newPerson, setNewPerson] = useState("");
  const [newPersonSocial, setNewPersonSocial] = useState("");
  const [newTag, setNewTag] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  async function addPerson() {
    const name = newPerson.trim();
    if (!name) {
      setError("Name cannot be empty");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("people").insert({
      name,
      social_media: newPersonSocial.trim() || null
    });
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
    setNewPerson("");
    setNewPersonSocial("");
    await onPeopleChange();
    setBusy(false);
  }
  async function addTag() {
    const tag = newTag.trim();
    if (!tag) {
      setError("Tag cannot be empty");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from("tags").insert({ tag });
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }
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
    border: `2px solid ${C$2.black}`,
    background: tab === key ? C$2.black : C$2.surface,
    color: tab === key ? C$2.surface : C$2.black,
    padding: "8px 20px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "all 0.1s ease"
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: overlayRef,
      onClick: (e) => {
        if (e.target === overlayRef.current) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(28,27,27,0.55)",
        zIndex: 9e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          background: C$2.surface,
          border: `3px solid ${C$2.black}`,
          boxShadow: `8px 8px 0px ${C$2.black}`,
          width: "100%",
          maxWidth: 560,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `2px solid ${C$2.black}`,
            background: C$2.black
          }
        },
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C$2.surface
            }
          },
          "Manage People & Tags"
        ),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            style: {
              background: "transparent",
              border: `2px solid ${C$2.surface}`,
              color: C$2.surface,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0
            }
          },
          "×"
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: `2px solid ${C$2.black}` } }, /* @__PURE__ */ React.createElement("button", { style: tabBtn("people"), onClick: () => {
        setTab("people");
        setError(null);
      } }, "👤 People ", people.length > 0 && `(${people.length})`), /* @__PURE__ */ React.createElement("button", { style: tabBtn("tags"), onClick: () => {
        setTab("tags");
        setError(null);
      } }, "# Tags ", tags.length > 0 && `(${tags.length})`)),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: 20 } }, error && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            border: `2px solid ${C$2.black}`,
            background: C$2.error,
            color: C$2.errorText,
            padding: "8px 14px",
            marginBottom: 16,
            fontWeight: 700,
            fontSize: 12
          }
        },
        error
      ), tab === "people" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: labelStyle }, "Add new person"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: newPerson,
          onChange: (e) => setNewPerson(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPerson();
            }
          },
          placeholder: "Name",
          style: { ...inputStyle, fontSize: 13 },
          onFocus: focusIn,
          onBlur: focusOut
        }
      ), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: newPersonSocial,
          onChange: (e) => setNewPersonSocial(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPerson();
            }
          },
          placeholder: "Social link (optional)",
          style: { ...inputStyle, fontSize: 13 },
          onFocus: focusIn,
          onBlur: focusOut
        }
      )), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: addPerson,
          disabled: busy,
          style: {
            border: `2px solid ${C$2.black}`,
            background: C$2.blue,
            color: C$2.black,
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: 12,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: `3px 3px 0px ${C$2.black}`,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 20,
            opacity: busy ? 0.6 : 1
          }
        },
        "+ Add Person"
      ), people.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { color: C$2.textSecondary, fontSize: 13, fontStyle: "italic" } }, "No people yet. Add someone above.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, people.map((p) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: p.id,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `2px solid ${C$2.black}`,
            background: C$2.surfaceAlt,
            padding: "8px 12px"
          }
        },
        /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 13 } }, p.name), p.social_media && /* @__PURE__ */ React.createElement(
          "a",
          {
            href: p.social_media,
            target: "_blank",
            rel: "noopener noreferrer",
            style: { marginLeft: 10, fontSize: 11, color: C$2.outline, textDecoration: "underline" }
          },
          p.social_media.replace(/https?:\/\/(www\.)?/, "")
        )),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => deletePerson(p.id, p.name),
            style: {
              border: `2px solid ${C$2.black}`,
              background: C$2.error,
              color: C$2.errorText,
              padding: "3px 9px",
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
              lineHeight: 1.4
            }
          },
          "×"
        )
      )))), tab === "tags" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: labelStyle }, "Add new tag"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: newTag,
          onChange: (e) => setNewTag(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          },
          placeholder: "Tag name",
          style: { ...inputStyle, fontSize: 13 },
          onFocus: focusIn,
          onBlur: focusOut
        }
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: addTag,
          disabled: busy,
          style: {
            border: `2px solid ${C$2.black}`,
            background: C$2.yellow,
            color: C$2.black,
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: 12,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: `3px 3px 0px ${C$2.black}`,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            flexShrink: 0,
            opacity: busy ? 0.6 : 1
          }
        },
        "+ Add Tag"
      )), tags.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { color: C$2.textSecondary, fontSize: 13, fontStyle: "italic" } }, "No tags yet. Add one above.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, tags.map((t) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: t.id,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: `2px solid ${C$2.black}`,
            background: C$2.yellow,
            padding: "6px 10px"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" } }, "#", t.tag),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => deleteTag(t.id, t.tag),
            style: {
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 14,
              lineHeight: 1,
              color: C$2.black,
              padding: "0 2px",
              opacity: 0.5
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.opacity = 1;
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.opacity = 0.5;
            }
          },
          "×"
        )
      ))))),
      /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 20px", borderTop: `2px solid ${C$2.black}`, display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onClose,
          style: {
            border: `2px solid ${C$2.black}`,
            background: C$2.black,
            color: C$2.surface,
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: "pointer"
          }
        },
        "Done"
      ))
    )
  );
}
function MemoryForm({ onSaved }) {
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
  function showToast(msg, type2 = "success") {
    setToast({ msg, type: type2 });
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
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      showToast("Please select an image first.", "error");
      return;
    }
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
      thumbnail = `https://res.cloudinary.com/${"dfluo0iya"}/video/upload/so_1/${cloudinary.public_id}.jpg`;
    }
    const { data: memory, error } = await supabase.from("memories").insert({
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
      featured
    }).select().single();
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
    if (error) {
      showToast(error.message, "error");
      return;
    }
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
    border: `2px solid ${C$2.black}`,
    background: active ? accent : C$2.surface,
    color: C$2.black,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    boxShadow: active ? `2px 2px 0px ${C$2.black}` : `4px 4px 0px ${C$2.black}`,
    transform: active ? "translate(2px,2px)" : "none",
    transition: "all .12s ease"
  });
  const hasCoords = latitude !== "" && longitude !== "";
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, toast && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        border: `3px solid ${C$2.black}`,
        background: toast.type === "error" ? C$2.error : C$2.green,
        color: toast.type === "error" ? C$2.errorText : "#1a4a0a",
        padding: "12px 20px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        boxShadow: `5px 5px 0px ${C$2.black}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: 320
      }
    },
    /* @__PURE__ */ React.createElement("span", null, toast.type === "error" ? "✕" : "✓"),
    toast.msg
  ), /* @__PURE__ */ React.createElement(
    ManageModal,
    {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      tags,
      people,
      onTagsChange: reloadTags,
      onPeopleChange: reloadPeople
    }
  ), locationPickerOpen && /* @__PURE__ */ React.createElement(
    LocationPicker,
    {
      lat: latitude,
      lng: longitude,
      onConfirm: (lat, lng) => {
        setLatitude(lat);
        setLongitude(lng);
      },
      onClose: () => setLocationPickerOpen(false)
    }
  ), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
      className: "form-grid-2"
    },
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Title *"), /* @__PURE__ */ React.createElement(
      "input",
      {
        style: inputStyle,
        placeholder: "e.g. Sunset at Bromo",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        required: true,
        onFocus: focusIn,
        onBlur: focusOut
      }
    )),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Date"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "date",
        style: inputStyle,
        value: date,
        onChange: (e) => setDate(e.target.value),
        onFocus: focusIn,
        onBlur: focusOut
      }
    ))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
      className: "form-grid-2"
    },
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Location"), /* @__PURE__ */ React.createElement(
      "input",
      {
        style: inputStyle,
        placeholder: "e.g. Bromo, East Java",
        value: location,
        onChange: (e) => setLocation(e.target.value),
        onFocus: focusIn,
        onBlur: focusOut
      }
    )),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Featured"), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setFeatured(!featured),
        style: {
          border: `2px solid ${C$2.black}`,
          background: featured ? C$2.yellow : C$2.surface,
          color: C$2.onSurface,
          padding: "10px 14px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: `3px 3px 0px ${C$2.black}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.12s ease",
          width: "100%",
          textAlign: "left"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translate(2px,2px)";
          e.currentTarget.style.boxShadow = "none";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = `3px 3px 0px ${C$2.black}`;
        }
      },
      /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            width: 18,
            height: 18,
            border: `2px solid ${C$2.black}`,
            background: featured ? C$2.black : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }
        },
        featured && /* @__PURE__ */ React.createElement("span", { style: { color: C$2.yellow, fontSize: 10, fontWeight: 900, lineHeight: 1 } }, "✓")
      ),
      featured ? "⭐ Featured" : "Mark as Featured"
    ))
  ), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }, className: "form-grid-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Latitude"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "any",
      style: inputStyle,
      placeholder: "e.g. -7.9424",
      value: latitude,
      onChange: (e) => setLatitude(e.target.value),
      onFocus: focusIn,
      onBlur: focusOut
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Longitude"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      step: "any",
      style: inputStyle,
      placeholder: "e.g. 112.9530",
      value: longitude,
      onChange: (e) => setLongitude(e.target.value),
      onFocus: focusIn,
      onBlur: focusOut
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setLocationPickerOpen(true),
      style: {
        border: `2px solid ${C$2.black}`,
        background: hasCoords ? C$2.yellow : C$2.blue,
        color: C$2.black,
        padding: "8px 18px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: "pointer",
        boxShadow: `3px 3px 0px ${C$2.black}`,
        display: "flex",
        alignItems: "center",
        gap: 7,
        transition: "all 0.12s ease",
        flexShrink: 0
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translate(2px,2px)";
        e.currentTarget.style.boxShadow = "none";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = `3px 3px 0px ${C$2.black}`;
      }
    },
    hasCoords ? "Edit on Map" : "Pick on Map"
  ), hasCoords && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "span",
    {
      style: {
        fontFamily: "monospace",
        fontSize: 12,
        color: C$2.onSurfaceVariant,
        background: C$2.surfaceAlt,
        border: `1px solid ${C$2.outlineVariant}`,
        padding: "4px 10px"
      }
    },
    Number(latitude).toFixed(4),
    ", ",
    Number(longitude).toFixed(4)
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        setLatitude("");
        setLongitude("");
      },
      style: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 14,
        color: C$2.outline,
        padding: "4px 6px",
        fontWeight: 900
      },
      title: "Clear coordinates"
    },
    "✕"
  )))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Description"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      style: { ...inputStyle, resize: "vertical", minHeight: 80 },
      placeholder: "Write a short memory description...",
      value: description,
      onChange: (e) => setDescription(e.target.value),
      rows: 3,
      onFocus: focusIn,
      onBlur: focusOut
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { ...labelStyle, marginBottom: 0 } }, "People"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setManageOpen(true),
      style: {
        border: `2px solid ${C$2.black}`,
        background: C$2.surface,
        color: C$2.black,
        padding: "4px 10px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        cursor: "pointer",
        boxShadow: `2px 2px 0px ${C$2.black}`,
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    },
    "⚙ Manage"
  )), people.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C$2.textSecondary, fontStyle: "italic" } }, "No people yet —", " ", /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setManageOpen(true),
      style: { background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontStyle: "italic", fontSize: 12, color: C$2.textSecondary }
    },
    "add someone"
  )) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 } }, people.map((person) => {
    const active = selectedPeople.includes(person.id);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: person.id,
        type: "button",
        onClick: () => setSelectedPeople(
          (prev) => active ? prev.filter((id) => id !== person.id) : [...prev, person.id]
        ),
        style: chipStyle(active, C$2.blue)
      },
      active ? "✓ " : "",
      person.name
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("label", { style: { ...labelStyle, marginBottom: 0 } }, "Tags"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setManageOpen(true),
      style: {
        border: `2px solid ${C$2.black}`,
        background: C$2.surface,
        color: C$2.black,
        padding: "4px 10px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        cursor: "pointer",
        boxShadow: `2px 2px 0px ${C$2.black}`,
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    },
    "⚙ Manage"
  )), tags.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: C$2.textSecondary, fontStyle: "italic" } }, "No tags yet —", " ", /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setManageOpen(true),
      style: { background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontStyle: "italic", fontSize: 12, color: C$2.textSecondary }
    },
    "create one"
  )) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 } }, tags.map((tag) => {
    const active = selectedTags.includes(tag.id);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tag.id,
        type: "button",
        onClick: () => setSelectedTags(
          (prev) => active ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
        ),
        style: chipStyle(active, C$2.yellow)
      },
      active ? "✓ " : "",
      tag.tag
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Image *"), /* @__PURE__ */ React.createElement(
    "div",
    {
      onDragOver: (e) => {
        e.preventDefault();
        setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: handleDrop,
      onClick: () => document.getElementById("mem-file-input").click(),
      style: {
        border: `3px dashed ${dragOver ? C$2.yellow : C$2.black}`,
        background: dragOver ? "#FEF9E7" : C$2.surfaceAlt,
        cursor: "pointer",
        transition: "all 0.12s ease",
        overflow: "hidden",
        position: "relative",
        minHeight: preview ? "auto" : 120
      }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "mem-file-input",
        type: "file",
        accept: "image/*,video/*",
        style: { display: "none" },
        onChange: (e) => handleFileChange(e.target.files[0])
      }
    ),
    preview ? /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, file?.type.startsWith("video/") ? /* @__PURE__ */ React.createElement("video", { src: preview, controls: true, style: { width: "100%", maxHeight: 220, objectFit: "cover" } }) : /* @__PURE__ */ React.createElement("img", { src: preview, alt: "Preview", style: { width: "100%", maxHeight: 220, objectFit: "cover" } }), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "img-overlay",
        style: {
          position: "absolute",
          inset: 0,
          background: "rgba(28,27,27,0.55)",
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.15s"
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, border: "2px solid #fff", padding: "6px 14px", textTransform: "uppercase", letterSpacing: "0.06em" } }, "Change Image")
    )) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 8, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", color: C$2.onSurface, margin: 0 } }, "Drop image/video here or click to browse"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "'Inter', sans-serif", fontSize: 11, color: C$2.textSecondary, margin: 0 } }, "PNG · JPG · WEBP · MP4 · MOV"))
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: loading,
      style: {
        width: "100%",
        border: `3px solid ${C$2.black}`,
        background: loading ? C$2.surfaceAlt : C$2.black,
        color: loading ? C$2.outline : "#FFFDF8",
        padding: "14px 24px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : `5px 5px 0px ${C$2.yellow}`,
        transition: "all 0.12s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
      },
      onMouseEnter: (e) => {
        if (!loading) {
          e.currentTarget.style.transform = "translate(3px,3px)";
          e.currentTarget.style.boxShadow = "none";
        }
      },
      onMouseLeave: (e) => {
        if (!loading) {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = `5px 5px 0px ${C$2.yellow}`;
        }
      }
    },
    loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", style: { animation: "spin 0.8s linear infinite" } }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3", opacity: "0.3" }), /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })), "Uploading...") : "↑ Upload Memory"
  )), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr !important; } }
        .img-overlay:hover { opacity: 1 !important; }
        div:hover > .img-overlay { opacity: 1 !important; }
      `));
}

const C$1 = {
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
  errorText: "#7A0000"
};
const inputBase = {
  width: "100%",
  border: `2px solid ${C$1.black}`,
  background: C$1.surfaceAlt,
  padding: "9px 12px",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: C$1.black,
  outline: "none",
  boxShadow: `3px 3px 0px ${C$1.black}`,
  transition: "all 0.1s ease",
  boxSizing: "border-box"
};
const focusHandlers = {
  onFocus: (e) => {
    e.target.style.background = C$1.surface;
    e.target.style.boxShadow = "none";
    e.target.style.transform = "translate(2px,2px)";
  },
  onBlur: (e) => {
    e.target.style.background = C$1.surfaceAlt;
    e.target.style.boxShadow = `3px 3px 0px ${C$1.black}`;
    e.target.style.transform = "none";
  }
};
function Field({ label, children }) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement(
    "span",
    {
      style: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: C$1.outlineVariant
      }
    },
    label
  ), children);
}
function Input({ value, onChange, placeholder, type = "text", disabled }) {
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      type,
      value,
      onChange,
      placeholder,
      disabled,
      style: {
        ...inputBase,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text"
      },
      ...focusHandlers
    }
  );
}
function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows,
      value,
      onChange,
      placeholder,
      style: { ...inputBase, resize: "vertical", minHeight: 72 },
      ...focusHandlers
    }
  );
}
function Chip({ label, selected, accent = C$1.yellow, onClick }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      onKeyDown: (e) => (e.key === " " || e.key === "Enter") && onClick(),
      style: {
        border: `2px solid ${selected ? C$1.black : C$1.outline}`,
        background: selected ? accent : C$1.surfaceAlt,
        color: C$1.black,
        padding: "4px 11px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: "pointer",
        boxShadow: selected ? `2px 2px 0px ${C$1.black}` : "none",
        transition: "all 0.1s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        opacity: selected ? 1 : 0.7
      }
    },
    selected && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 900, lineHeight: 1 } }, "✓"),
    label
  );
}
function SectionDivider({ label }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        borderTop: `2px dashed ${C$1.surfaceContainerHigh}`,
        paddingTop: 12,
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    },
    /* @__PURE__ */ React.createElement(
      "span",
      {
        style: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: C$1.outlineVariant,
          whiteSpace: "nowrap"
        }
      },
      label
    ),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: C$1.surfaceContainerHigh } })
  );
}
function EditMemoryModal({ memory, onClose, onSaved }) {
  const [title, setTitle] = useState(memory.title || "");
  const [slug, setSlug] = useState(memory.slug || "");
  const [type, setType] = useState(memory.type || "Photo");
  const [description, setDescription] = useState(memory.description || "");
  const [date, setDate] = useState(memory.date || "");
  const [year, setYear] = useState(memory.year ?? "");
  const [location, setLocation] = useState(memory.location || "");
  const [latitude, setLatitude] = useState(
    memory.latitude != null ? String(memory.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    memory.longitude != null ? String(memory.longitude) : ""
  );
  const [src, setSrc] = useState(memory.src || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(memory.thumbnail_url || "");
  const [featured, setFeatured] = useState(memory.featured || false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(memory.src || null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);
  const [allPeople, setAllPeople] = useState([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState([]);
  const [loadingRelations, setLoadingRelations] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  function slugify(text) {
    return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
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
  useEffect(() => {
    (async () => {
      const [
        { data: tags, error: e1 },
        { data: people, error: e2 },
        { data: memTags, error: e3 },
        { data: memPeople, error: e4 }
      ] = await Promise.all([
        supabase.from("tags").select("id, tag").order("tag"),
        supabase.from("people").select("id, name").order("name"),
        supabase.from("memory_tags").select("tag_id").eq("memory_id", memory.id),
        supabase.from("memory_people").select("person_id").eq("memory_id", memory.id)
      ]);
      if (e1 || e2 || e3 || e4)
        showToast("Could not load tags or people.", "error");
      setAllTags(tags ?? []);
      setAllPeople(people ?? []);
      setSelectedTagIds((memTags ?? []).map((r) => r.tag_id));
      setSelectedPersonIds((memPeople ?? []).map((r) => r.person_id));
      setLoadingRelations(false);
    })();
  }, [memory.id]);
  const toggleTag = (id) => setSelectedTagIds(
    (p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
  );
  const togglePerson = (id) => setSelectedPersonIds(
    (p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
  );
  async function handleCreateTag() {
    const tag = newTagInput.trim();
    if (!tag) return;
    setAddingTag(true);
    const { data, error } = await supabase.from("tags").insert({ tag }).select().single();
    if (error) {
      showToast(error.message, "error");
    } else {
      setAllTags(
        (p) => [...p, data].sort((a, b) => a.tag.localeCompare(b.tag))
      );
      setSelectedTagIds((p) => [...p, data.id]);
      showToast(`Tag "${tag}" created`, "success");
    }
    setNewTagInput("");
    setAddingTag(false);
  }
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
  function showToast(msg, kind = "success") {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  }
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
      latitude: latitude !== "" ? Number(latitude) : null,
      longitude: longitude !== "" ? Number(longitude) : null
    };
    if (file) {
      try {
        setUploading(true);
        const folder = memory.year ? memory.year : (/* @__PURE__ */ new Date()).getFullYear();
        const result = await uploadToCloudinary(
          file,
          `pasha-archive/${folder}`
        );
        updateData.src = result.secure_url;
        updateData.cloudinary_public_id = result.public_id;
        updateData.type = result.resource_type === "video" ? "Video" : "Photo";
        if (result.resource_type === "video") {
          updateData.thumbnail_url = `https://res.cloudinary.com/${"dfluo0iya"}/video/upload/so_1/${result.public_id}.jpg`;
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
    const { error: memErr } = await supabase.from("memories").update(updateData).eq("id", memory.id);
    if (memErr) {
      showToast(memErr.message, "error");
      setSaving(false);
      return;
    }
    await supabase.from("memory_tags").delete().eq("memory_id", memory.id);
    if (selectedTagIds.length > 0) {
      const { error: tagErr } = await supabase.from("memory_tags").insert(
        selectedTagIds.map((tag_id) => ({ memory_id: memory.id, tag_id }))
      );
      if (tagErr) {
        showToast(`Tags: ${tagErr.message}`, "error");
        setSaving(false);
        return;
      }
    }
    await supabase.from("memory_people").delete().eq("memory_id", memory.id);
    if (selectedPersonIds.length > 0) {
      const { error: personErr } = await supabase.from("memory_people").insert(
        selectedPersonIds.map((person_id) => ({
          memory_id: memory.id,
          person_id
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
  const hasCoords = latitude !== "" && longitude !== "";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: (e) => e.target === e.currentTarget && onClose(),
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(17,17,17,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }
    },
    toast && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10001,
          border: `3px solid ${C$1.black}`,
          background: toast.kind === "error" ? C$1.error : C$1.green,
          color: toast.kind === "error" ? C$1.errorText : "#1a4a0a",
          padding: "12px 20px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          boxShadow: `5px 5px 0px ${C$1.black}`,
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      },
      toast.kind === "error" ? "✕ " : "✓ ",
      toast.msg
    ),
    locationPickerOpen && /* @__PURE__ */ React.createElement(
      LocationPicker,
      {
        lat: latitude,
        lng: longitude,
        onConfirm: (lat, lng) => {
          setLatitude(lat);
          setLongitude(lng);
        },
        onClose: () => setLocationPickerOpen(false)
      }
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "animate-in",
        style: {
          width: "100%",
          maxWidth: 900,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          border: `4px solid ${C$1.black}`,
          boxShadow: `10px 10px 0px ${C$1.black}`,
          background: C$1.surface,
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            background: C$1.black,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              background: C$1.yellow,
              color: C$1.black,
              padding: "2px 10px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }
          },
          "Edit"
        ), /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#fff",
              maxWidth: 340,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          },
          memory.title || "Untitled"
        ), /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: "#666",
              fontWeight: 500
            }
          },
          "#",
          memory.id
        )),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            style: {
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
              flexShrink: 0
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "#333";
              e.currentTarget.style.color = "#fff";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#aaa";
            }
          },
          "✕"
        )
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              width: 240,
              flexShrink: 0,
              borderRight: `3px solid ${C$1.black}`,
              background: C$1.black,
              display: "flex",
              flexDirection: "column"
            }
          },
          /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 200, flexShrink: 0 } }, preview ? /* @__PURE__ */ React.createElement(React.Fragment, null, type === "Video" ? /* @__PURE__ */ React.createElement(
            "video",
            {
              src: preview,
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              },
              muted: true,
              playsInline: true
            }
          ) : /* @__PURE__ */ React.createElement(
            "img",
            {
              src: preview,
              alt: title,
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }
            }
          ), /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.18s ease",
                cursor: "pointer"
              },
              onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
              onMouseLeave: (e) => e.currentTarget.style.opacity = "0",
              onClick: () => document.getElementById("em-file").click()
            },
            /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  background: C$1.yellow,
                  border: `2px solid ${C$1.black}`,
                  color: C$1.black,
                  padding: "6px 14px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  boxShadow: `3px 3px 0px ${C$1.black}`
                }
              },
              "↻ Replace"
            )
          )) : /* @__PURE__ */ React.createElement(
            "label",
            {
              onDragOver: (e) => {
                e.preventDefault();
                setDragOver(true);
              },
              onDragLeave: () => setDragOver(false),
              onDrop: handleDrop,
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: "100%",
                cursor: "pointer",
                background: dragOver ? "rgba(254,215,76,0.08)" : "transparent",
                border: `2px dashed ${dragOver ? C$1.yellow : "#444"}`,
                transition: "all 0.15s ease"
              }
            },
            /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "📷"),
            /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center"
                }
              },
              "Drop or click",
              /* @__PURE__ */ React.createElement("br", null),
              "to upload"
            )
          ), /* @__PURE__ */ React.createElement(
            "input",
            {
              id: "em-file",
              type: "file",
              accept: "image/*,video/*",
              onChange: (e) => handleFileChange(e.target.files?.[0]),
              style: { display: "none" }
            }
          )),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                borderTop: `3px solid #333`,
                padding: "10px 12px",
                display: "flex",
                gap: 6
              }
            },
            ["Photo", "Video"].map((t) => /* @__PURE__ */ React.createElement(
              "button",
              {
                key: t,
                onClick: () => setType(t),
                style: {
                  flex: 1,
                  border: `2px solid ${type === t ? C$1.yellow : "#444"}`,
                  background: type === t ? C$1.yellow : "transparent",
                  color: type === t ? C$1.black : "#888",
                  padding: "6px 0",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.12s ease",
                  boxShadow: type === t ? `2px 2px 0px ${C$1.black}` : "none"
                }
              },
              t === "Photo" ? "Photo" : "Video"
            ))
          ),
          /* @__PURE__ */ React.createElement("div", { style: { borderTop: `3px solid #333`, padding: "10px 12px" } }, /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => setFeatured(!featured),
              style: {
                width: "100%",
                border: `2px solid ${featured ? C$1.yellow : "#444"}`,
                background: featured ? "rgba(254,215,76,0.12)" : "transparent",
                color: featured ? C$1.yellow : "#666",
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
                transition: "all 0.12s ease"
              }
            },
            /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  width: 14,
                  height: 14,
                  border: `2px solid ${featured ? C$1.yellow : "#555"}`,
                  background: featured ? C$1.yellow : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 9,
                  color: C$1.black,
                  fontWeight: 900
                }
              },
              featured && "✓"
            ),
            featured ? "Featured" : "Mark featured"
          )),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: { borderTop: `3px solid #333`, padding: "12px", flex: 1 }
            },
            /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#666",
                  display: "block",
                  marginBottom: 6
                }
              },
              "Media URL"
            ),
            /* @__PURE__ */ React.createElement(
              "input",
              {
                value: src,
                onChange: (e) => {
                  setSrc(e.target.value);
                  setPreview(e.target.value);
                },
                placeholder: "https://...",
                style: {
                  width: "100%",
                  border: "1px solid #333",
                  background: "#1a1a1a",
                  padding: "7px 10px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: "#ccc",
                  outline: "none",
                  boxSizing: "border-box"
                }
              }
            ),
            type === "Video" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#666",
                  display: "block",
                  marginTop: 10,
                  marginBottom: 6
                }
              },
              "Thumbnail URL"
            ), /* @__PURE__ */ React.createElement(
              "input",
              {
                value: thumbnailUrl,
                onChange: (e) => setThumbnailUrl(e.target.value),
                placeholder: "https://...",
                style: {
                  width: "100%",
                  border: "1px solid #333",
                  background: "#1a1a1a",
                  padding: "7px 10px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: "#ccc",
                  outline: "none",
                  boxSizing: "border-box"
                }
              }
            ))
          )
        ),
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }
          },
          /* @__PURE__ */ React.createElement(Field, { label: "Title *" }, /* @__PURE__ */ React.createElement(
            Input,
            {
              value: title,
              onChange: handleTitleChange,
              placeholder: "Memory title"
            }
          )),
          /* @__PURE__ */ React.createElement(Field, { label: "Slug" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
            "span",
            {
              style: {
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 12,
                color: C$1.outlineVariant,
                pointerEvents: "none",
                zIndex: 1
              }
            },
            "/"
          ), /* @__PURE__ */ React.createElement(
            "input",
            {
              value: slug,
              onChange: (e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              },
              placeholder: "auto-generated",
              style: { ...inputBase, paddingLeft: 20 },
              onFocus: (e) => {
                setSlugTouched(true);
                e.target.style.background = C$1.surface;
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translate(2px,2px)";
              },
              onBlur: (e) => {
                e.target.style.background = C$1.surfaceAlt;
                e.target.style.boxShadow = `3px 3px 0px ${C$1.black}`;
                e.target.style.transform = "none";
              },
              disabled: true
            }
          ))),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 100px",
                gap: 12
              }
            },
            /* @__PURE__ */ React.createElement(Field, { label: "Date" }, /* @__PURE__ */ React.createElement(Input, { type: "date", value: date, onChange: handleDateChange })),
            /* @__PURE__ */ React.createElement(Field, { label: "Year" }, /* @__PURE__ */ React.createElement(
              Input,
              {
                type: "number",
                value: year,
                onChange: (e) => setYear(e.target.value),
                placeholder: "2024"
              }
            ))
          ),
          /* @__PURE__ */ React.createElement(Field, { label: "Location" }, /* @__PURE__ */ React.createElement(
            Input,
            {
              value: location,
              onChange: (e) => setLocation(e.target.value),
              placeholder: "e.g. Bromo, East Java"
            }
          )),
          /* @__PURE__ */ React.createElement(SectionDivider, { label: "Coordinates" }),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12
              }
            },
            /* @__PURE__ */ React.createElement(Field, { label: "Latitude" }, /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "number",
                step: "any",
                value: latitude,
                onChange: (e) => setLatitude(e.target.value),
                placeholder: "e.g. -7.9424",
                style: inputBase,
                ...focusHandlers
              }
            )),
            /* @__PURE__ */ React.createElement(Field, { label: "Longitude" }, /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "number",
                step: "any",
                value: longitude,
                onChange: (e) => setLongitude(e.target.value),
                placeholder: "e.g. 112.9530",
                style: inputBase,
                ...focusHandlers
              }
            ))
          ),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap"
              }
            },
            /* @__PURE__ */ React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setLocationPickerOpen(true),
                style: {
                  border: `2px solid ${C$1.black}`,
                  background: hasCoords ? C$1.yellow : C$1.blue,
                  color: C$1.black,
                  padding: "7px 16px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  boxShadow: `2px 2px 0px ${C$1.black}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.1s ease",
                  flexShrink: 0
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.transform = "translate(2px,2px)";
                  e.currentTarget.style.boxShadow = "none";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `2px 2px 0px ${C$1.black}`;
                }
              },
              hasCoords ? "Edit on Map" : "Pick on Map"
            ),
            hasCoords && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
              "span",
              {
                style: {
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: C$1.outlineVariant,
                  background: C$1.surfaceContainerHigh,
                  border: `1px solid ${C$1.outline}`,
                  padding: "4px 10px"
                }
              },
              Number(latitude).toFixed(4),
              ",",
              " ",
              Number(longitude).toFixed(4)
            ), /* @__PURE__ */ React.createElement(
              "button",
              {
                type: "button",
                onClick: () => {
                  setLatitude("");
                  setLongitude("");
                },
                style: {
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  color: C$1.outline,
                  padding: "4px 6px",
                  fontWeight: 900
                },
                title: "Clear coordinates"
              },
              "✕"
            ))
          ),
          /* @__PURE__ */ React.createElement(Field, { label: "Description" }, /* @__PURE__ */ React.createElement(
            Textarea,
            {
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: "Short description of this memory…",
              rows: 4
            }
          )),
          /* @__PURE__ */ React.createElement(SectionDivider, { label: "Tags" }),
          /* @__PURE__ */ React.createElement(
            Field,
            {
              label: `Tags${selectedTagIds.length ? ` · ${selectedTagIds.length} selected` : ""}`
            },
            loadingRelations ? /* @__PURE__ */ React.createElement(
              "p",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: C$1.outlineVariant,
                  margin: 0
                }
              },
              "Loading…"
            ) : /* @__PURE__ */ React.createElement(React.Fragment, null, allTags.length === 0 ? /* @__PURE__ */ React.createElement(
              "p",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: C$1.outlineVariant,
                  margin: 0
                }
              },
              "No tags yet — create one below."
            ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, allTags.map((tag) => /* @__PURE__ */ React.createElement(
              Chip,
              {
                key: tag.id,
                label: tag.tag,
                selected: selectedTagIds.includes(tag.id),
                accent: C$1.yellow,
                onClick: () => toggleTag(tag.id)
              }
            ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10 } }, /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "text",
                value: newTagInput,
                onChange: (e) => setNewTagInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                },
                placeholder: "New tag name…",
                style: { ...inputBase, fontSize: 12, flex: 1 },
                ...focusHandlers
              }
            ), /* @__PURE__ */ React.createElement(
              "button",
              {
                onClick: handleCreateTag,
                disabled: addingTag || !newTagInput.trim(),
                style: {
                  border: `2px solid ${C$1.black}`,
                  background: C$1.yellow,
                  color: C$1.black,
                  padding: "8px 14px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  cursor: addingTag || !newTagInput.trim() ? "not-allowed" : "pointer",
                  opacity: addingTag || !newTagInput.trim() ? 0.5 : 1,
                  flexShrink: 0,
                  whiteSpace: "nowrap"
                }
              },
              "+ Create"
            )))
          ),
          /* @__PURE__ */ React.createElement(SectionDivider, { label: "People in Frame" }),
          /* @__PURE__ */ React.createElement(
            Field,
            {
              label: `People${selectedPersonIds.length ? ` · ${selectedPersonIds.length} tagged` : ""}`
            },
            loadingRelations ? /* @__PURE__ */ React.createElement(
              "p",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: C$1.outlineVariant,
                  margin: 0
                }
              },
              "Loading…"
            ) : allPeople.length === 0 ? /* @__PURE__ */ React.createElement(
              "p",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  color: C$1.outlineVariant,
                  margin: 0
                }
              },
              "No people in registry. Add them to the ",
              /* @__PURE__ */ React.createElement("code", null, "people"),
              " ",
              "table first."
            ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, allPeople.map((person) => /* @__PURE__ */ React.createElement(
              Chip,
              {
                key: person.id,
                label: person.name,
                selected: selectedPersonIds.includes(person.id),
                accent: C$1.pink,
                onClick: () => togglePerson(person.id)
              }
            )))
          ),
          /* @__PURE__ */ React.createElement(SectionDivider, { label: "Meta" }),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12
              }
            },
            /* @__PURE__ */ React.createElement(Field, { label: "Cloudinary ID" }, /* @__PURE__ */ React.createElement(Input, { value: memory.cloudinary_public_id || "—", disabled: true }))
          )
        )
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            borderTop: `3px solid ${C$1.black}`,
            background: C$1.surfaceAlt,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0
          }
        },
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: C$1.outlineVariant,
              fontWeight: 500
            }
          },
          busy ? uploading ? "⏳ Uploading to Cloudinary…" : "⏳ Saving…" : `ID ${memory.id} · ${selectedTagIds.length} tag${selectedTagIds.length !== 1 ? "s" : ""} · ${selectedPersonIds.length} person${selectedPersonIds.length !== 1 ? "s" : ""}${hasCoords ? " · pinned" : ""}`
        ),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            disabled: busy,
            style: {
              border: `3px solid ${C$1.black}`,
              background: C$1.surface,
              color: C$1.black,
              padding: "10px 22px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.5 : 1
            }
          },
          "Cancel"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleSave,
            disabled: busy,
            style: {
              border: `3px solid ${C$1.black}`,
              background: busy ? C$1.surfaceContainerHigh : C$1.yellow,
              color: C$1.black,
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
              boxShadow: busy ? "none" : `5px 5px 0px ${C$1.black}`
            }
          },
          busy ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
            "svg",
            {
              width: "12",
              height: "12",
              viewBox: "0 0 24 24",
              fill: "none",
              style: {
                animation: "spin 0.8s linear infinite",
                flexShrink: 0
              }
            },
            /* @__PURE__ */ React.createElement(
              "circle",
              {
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "3",
                opacity: "0.25"
              }
            ),
            /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
          ), uploading ? "Uploading…" : "Saving…") : "✓ Save changes"
        ))
      )
    ),
    /* @__PURE__ */ React.createElement("style", null, `
        @keyframes spin { to { transform: rotate(360deg); } }
      `)
  );
}

const C = {
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  black: "#1c1b1b",
  onSurface: "#1c1b1b",
  onSurfaceVariant: "#444748",
  outline: "#747878",
  outlineVariant: "#c4c7c7",
  yellow: "#FED74C"};
function MemoryTable({ refreshKey }) {
  const [memories, setMemories] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  async function loadMemories() {
    setLoading(true);
    const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
    if (!error) setMemories(data || []);
    setLoading(false);
  }
  async function deleteMemory(memory) {
    const confirmed = confirm(
      `Delete "${memory.title}"?

This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(memory.id);
    await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        publicId: memory.cloudinary_public_id,
        type: memory.type
      })
    });
    const { error } = await supabase.from("memories").delete().eq("id", memory.id);
    if (error) console.error(error);
    setDeletingId(null);
    loadMemories();
  }
  useEffect(() => {
    loadMemories();
  }, [refreshKey]);
  const filtered = memories.filter(
    (m) => (m.title || "").toLowerCase().includes(search.toLowerCase()) || (m.location || "").toLowerCase().includes(search.toLowerCase()) || String(m.year || "").includes(search)
  );
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: `2px solid ${C.outlineVariant}`
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          border: `2px solid ${C.black}`,
          background: C.yellow,
          padding: "4px 12px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          boxShadow: `2px 2px 0px ${C.black}`
        }
      },
      filtered.length
    ), /* @__PURE__ */ React.createElement(
      "span",
      {
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: C.onSurfaceVariant
        }
      },
      "of ",
      memories.length,
      " memories"
    )),
    /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
      "span",
      {
        style: {
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 13,
          color: C.outline
        }
      },
      "🔍"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Search title, location, year…",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        style: {
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
          width: 240
        },
        onFocus: (e) => {
          e.target.style.background = C.surface;
          e.target.style.boxShadow = "none";
          e.target.style.transform = "translate(2px,2px)";
        },
        onBlur: (e) => {
          e.target.style.background = C.surfaceAlt;
          e.target.style.boxShadow = `3px 3px 0px ${C.black}`;
          e.target.style.transform = "none";
        }
      }
    ))
  ), loading && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        gap: 12,
        color: C.onSurfaceVariant
      }
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        style: { animation: "spin 0.8s linear infinite" }
      },
      /* @__PURE__ */ React.createElement(
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "3",
          opacity: "0.25"
        }
      ),
      /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M4 12a8 8 0 018-8v8H4z" })
    ),
    /* @__PURE__ */ React.createElement(
      "span",
      {
        style: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.07em"
        }
      },
      "Loading…"
    )
  ), !loading && filtered.length === 0 && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        border: `3px dashed ${C.outlineVariant}`,
        padding: "60px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        background: C.surfaceAlt
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 48 } }, "📭"),
    /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: C.onSurface,
          margin: 0
        }
      },
      "No memories found"
    ),
    search && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setSearch(""),
        style: {
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
          transition: "all 0.12s ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = "translate(2px,2px)";
          e.currentTarget.style.boxShadow = "none";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`;
        }
      },
      "Clear Search"
    )
  ), !loading && filtered.length > 0 && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20
      }
    },
    filtered.map((memory) => /* @__PURE__ */ React.createElement(
      MemoryCard,
      {
        key: memory.id,
        memory,
        deletingId,
        onEdit: () => setEditingMemory(memory),
        onDelete: () => deleteMemory(memory)
      }
    ))
  ), editingMemory && /* @__PURE__ */ React.createElement(
    EditMemoryModal,
    {
      memory: editingMemory,
      onClose: () => setEditingMemory(null),
      onSaved: loadMemories
    }
  ), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes spin { to { transform: rotate(360deg); } }
      `));
}
function MemoryCard({ memory, deletingId, onEdit, onDelete }) {
  const C_local = {
    black: "#1c1b1b",
    surface: "#FFFDF8",
    yellow: "#FED74C",
    blue: "#BFD9FF",
    pink: "#F6D1D8",
    surfaceAlt: "#ECE6D8",
    onSurface: "#1c1b1b",
    onSurfaceVariant: "#444748",
    textSecondary: "#6B7280"
  };
  const isDeleting = deletingId === memory.id;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        border: `3px solid ${C_local.black}`,
        background: C_local.surface,
        boxShadow: `5px 5px 0px ${C_local.black}`,
        overflow: "hidden",
        transition: "all 0.12s ease",
        display: "flex",
        flexDirection: "column"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translate(3px,3px)";
        e.currentTarget.style.boxShadow = "none";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = `5px 5px 0px ${C_local.black}`;
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "relative",
          height: 160,
          borderBottom: `3px solid ${C_local.black}`,
          background: C_local.surfaceAlt,
          overflow: "hidden",
          flexShrink: 0
        }
      },
      memory.type === "Photo" ? /* @__PURE__ */ React.createElement(
        "img",
        {
          src: memory.src,
          alt: memory.title,
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }
        }
      ) : /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: memory.thumbnail_url }), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        },
        "▶️"
      )),
      memory.featured && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
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
            transform: "rotate(-1.5deg)"
          }
        },
        "⭐ Featured"
      ),
      memory.year && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
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
            letterSpacing: "0.04em"
          }
        },
        memory.year
      )
    ),
    /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 0", flex: 1 } }, /* @__PURE__ */ React.createElement(
      "h3",
      {
        style: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          margin: "0 0 4px",
          color: C_local.onSurface,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          lineHeight: 1.3
        }
      },
      memory.title
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          fontFamily: "monospace",
          fontSize: 10,
          color: C_local.textSecondary,
          margin: "0 0 8px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }
      },
      "/",
      memory.slug
    ), memory.location && /* @__PURE__ */ React.createElement(
      "p",
      {
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: C_local.onSurfaceVariant,
          margin: "0 0 12px",
          display: "flex",
          alignItems: "center",
          gap: 4
        }
      },
      /* @__PURE__ */ React.createElement("span", null, "📍"),
      memory.location
    )),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: 0,
          borderTop: `2px solid ${C_local.black}`,
          marginTop: "auto"
        }
      },
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onEdit,
          style: {
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
            transition: "background 0.1s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "#a8c8ff",
          onMouseLeave: (e) => e.currentTarget.style.background = C_local.blue
        },
        "✏ Edit"
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onDelete,
          disabled: isDeleting,
          style: {
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
            transition: "background 0.1s"
          },
          onMouseEnter: (e) => {
            if (!isDeleting) e.currentTarget.style.background = "#f0a0b0";
          },
          onMouseLeave: (e) => {
            if (!isDeleting) e.currentTarget.style.background = C_local.pink;
          }
        },
        isDeleting ? "…" : "✕ Delete"
      )
    )
  );
}

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("collection");
  const [refreshKey, setRefreshKey] = useState(0);
  async function handleLogout() {
    await supabase.auth.signOut();
  }
  function handleMemorySaved() {
    setRefreshKey((k) => k + 1);
    setActiveTab("collection");
  }
  const tabs = [
    { key: "collection", label: "Collection", icon: "◈" },
    { key: "add", label: "Add Memory", icon: "＋" }
  ];
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "#F3EFE6",
        fontFamily: "'Inter', sans-serif",
        color: "#1c1b1b"
      }
    },
    /* @__PURE__ */ React.createElement(
      "header",
      {
        style: {
          background: "#FFFDF8",
          borderBottom: "4px solid #1c1b1b",
          position: "sticky",
          top: 0,
          zIndex: 40
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            height: 60
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              border: "3px solid #1c1b1b",
              background: "#1c1b1b",
              color: "#FED74C",
              padding: "3px 8px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow: "3px 3px 0px #FED74C",
              transform: "rotate(-1deg)"
            }
          },
          "CMS"
        ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1,
              color: "#1c1b1b",
              textTransform: "uppercase",
              letterSpacing: "-0.01em"
            }
          },
          "Pasha Archive"
        ), /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: "#6B7280",
              marginTop: 2,
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          },
          user.email
        ))),
        /* @__PURE__ */ React.createElement("nav", { style: { display: "flex", alignItems: "center", gap: 6 }, className: "admin-desktop-nav" }, tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return /* @__PURE__ */ React.createElement(
            "button",
            {
              key: tab.key,
              onClick: () => setActiveTab(tab.key),
              style: {
                border: "2px solid #1c1b1b",
                background: isActive ? "#1c1b1b" : "#FFFDF8",
                color: isActive ? "#FFFDF8" : "#1c1b1b",
                padding: "7px 18px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: isActive ? "2px 2px 0px #FED74C" : "2px 2px 0px #1c1b1b",
                transform: isActive ? "translate(1px,1px)" : "none",
                transition: "all 0.12s ease"
              },
              onMouseEnter: (e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "translate(2px,2px)";
                  e.currentTarget.style.boxShadow = "none";
                }
              },
              onMouseLeave: (e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "2px 2px 0px #1c1b1b";
                }
              }
            },
            tab.icon,
            " ",
            tab.label
          );
        })),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleLogout,
            style: {
              border: "2px solid #1c1b1b",
              background: "#F6D1D8",
              color: "#1c1b1b",
              padding: "7px 16px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              boxShadow: "3px 3px 0px #1c1b1b",
              transition: "all 0.12s ease",
              flexShrink: 0
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translate(2px,2px)";
              e.currentTarget.style.boxShadow = "1px 1px 0px #1c1b1b";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "3px 3px 0px #1c1b1b";
            }
          },
          "✕ Logout"
        )
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "admin-mobile-nav",
          style: { borderTop: "3px solid #1c1b1b", display: "none" }
        },
        tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return /* @__PURE__ */ React.createElement(
            "button",
            {
              key: tab.key,
              onClick: () => setActiveTab(tab.key),
              style: {
                flex: 1,
                padding: "12px 0",
                background: isActive ? "#1c1b1b" : "#FFFDF8",
                color: isActive ? "#FED74C" : "#1c1b1b",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: "none",
                borderRight: "2px solid #1c1b1b",
                cursor: "pointer"
              }
            },
            tab.icon,
            " ",
            tab.label
          );
        })
      )
    ),
    /* @__PURE__ */ React.createElement("main", { style: { maxWidth: 1200, margin: "0 auto", padding: "40px 24px" } }, activeTab === "add" && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 680, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          border: "3px solid #1c1b1b",
          background: "#FED74C",
          padding: "8px 20px",
          boxShadow: "5px 5px 0px #1c1b1b",
          transform: "rotate(-1deg)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "h2",
        {
          style: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            margin: 0,
            color: "#1c1b1b",
            textTransform: "uppercase",
            letterSpacing: "-0.01em"
          }
        },
        "New Memory"
      )
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 3, background: "#1c1b1b" } })), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          border: "2px solid #1c1b1b",
          background: "#BFD9FF",
          padding: "12px 16px",
          marginBottom: 20,
          boxShadow: "4px 4px 0px #1c1b1b",
          display: "flex",
          alignItems: "flex-start",
          gap: 10
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, marginTop: 1, flexShrink: 0 } }, "💡"),
      /* @__PURE__ */ React.createElement(
        "p",
        {
          style: {
            margin: 0,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.6,
            color: "#1c1b1b"
          }
        },
        "Fill in the details and upload your photo. Slug is auto-generated from title. Toggle ",
        /* @__PURE__ */ React.createElement("strong", null, "Featured"),
        " to highlight this memory on the homepage."
      )
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          border: "3px solid #1c1b1b",
          background: "#FFFDF8",
          padding: "28px",
          boxShadow: "8px 8px 0px #1c1b1b"
        }
      },
      /* @__PURE__ */ React.createElement(MemoryForm, { onSaved: handleMemorySaved })
    )), activeTab === "collection" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            border: "3px solid #1c1b1b",
            background: "#1c1b1b",
            padding: "8px 20px",
            boxShadow: "5px 5px 0px #FED74C",
            transform: "rotate(0.5deg)"
          }
        },
        /* @__PURE__ */ React.createElement(
          "h2",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              margin: 0,
              color: "#FFFDF8",
              textTransform: "uppercase",
              letterSpacing: "-0.01em"
            }
          },
          "Collection"
        )
      ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 3, background: "#1c1b1b", minWidth: 40 } })),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setActiveTab("add"),
          style: {
            border: "2px solid #1c1b1b",
            background: "#FED74C",
            color: "#1c1b1b",
            padding: "10px 22px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            cursor: "pointer",
            boxShadow: "4px 4px 0px #1c1b1b",
            transition: "all 0.12s ease"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.transform = "translate(3px,3px)";
            e.currentTarget.style.boxShadow = "1px 1px 0px #1c1b1b";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "4px 4px 0px #1c1b1b";
          }
        },
        "＋ Add New"
      )
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          border: "3px solid #1c1b1b",
          background: "#FFFDF8",
          padding: "24px",
          boxShadow: "8px 8px 0px #1c1b1b"
        }
      },
      /* @__PURE__ */ React.createElement(MemoryTable, { refreshKey })
    ))),
    /* @__PURE__ */ React.createElement("style", null, `
        @media (max-width: 768px) {
          .admin-desktop-nav { display: none !important; }
          .admin-mobile-nav { display: flex !important; }
        }
      `)
  );
}

function AdminLogin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    checkSession();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function checkSession() {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }
  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      alert(error.message);
    }
  }
  if (user) {
    return /* @__PURE__ */ React.createElement(AdminDashboard, { user });
  }
  return /* @__PURE__ */ React.createElement("div", { className: "h-screen flex items-center justify-center p-10 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-6 -left-6 rotate-[-4deg] border-4 border-black bg-yellow-300 px-4 py-2 shadow-[6px_6px_0px_0px_#000] font-black z-10" }, "ADMIN ONLY"), /* @__PURE__ */ React.createElement("div", { className: "bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_#000] rotate-[1deg]" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-black uppercase" }, "Pasha Archive")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block mb-2 font-bold" }, "Email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "admin@admin.com",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      className: "w-full border-4 border-black px-4 py-3 bg-white outline-none focus:translate-x-1 focus:translate-y-1 transition-all"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block mb-2 font-bold" }, "Password"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      placeholder: "••••••••",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      className: "w-full border-4 border-black px-4 py-3 bg-white outline-none focus:translate-x-1 focus:translate-y-1 transition-all"
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleLogin,
      className: "\r\n                w-full\r\n                border-4 border-black\r\n                bg-black\r\n                text-white\r\n                py-3\r\n                font-black\r\n                uppercase\r\n                shadow-[5px_5px_0px_0px_#000]\r\n                hover:translate-x-1\r\n                hover:translate-y-1\r\n                hover:shadow-none\r\n                transition-all\r\n              "
    },
    "Login"
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-6 border-t-4 border-dashed border-black pt-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium" }, "Private access only.")))));
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminLogin", AdminLogin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/laragon/www/mdpashaaa-archive-web/src/components/Admin/AdminLogin", "client:component-export": "default" })} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/admin/index.astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
