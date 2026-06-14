import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

// ── Color tokens ──────────────────────────────────────────────────────────────
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

// ── Load Leaflet (consistent with LocationPicker.jsx) ──────────────────────────
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
    script.onerror = () => reject(new Error("Could not load Leaflet."));
    document.head.appendChild(script);
  });
}

// ── Mini Map Component ────────────────────────────────────────────────────────
function RequestMiniMap({ lat, lng }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (lat == null || lng == null) return;

    loadLeaflet()
      .then((L) => {
        if (!mapContainerRef.current || mapRef.current) return;

        const latitude = Number(lat);
        const longitude = Number(lng);

        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([latitude, longitude], 13);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        const pinIcon = L.divIcon({
          html: `<div style="
            width:24px;height:24px;
            background:${C.yellow};
            border:2px solid ${C.black};
            box-shadow:2px 2px 0 ${C.black};
            display:flex;align-items:center;justify-content:center;
            font-size:12px;line-height:1;
            transform:translate(-50%,-100%);
          ">📍</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          className: "",
        });

        L.marker([latitude, longitude], { icon: pinIcon }).addTo(map);
      })
      .catch((err) => {
        setMapError(err.message);
      });
  }, [lat, lng]);

  if (lat == null || lng == null) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: C.outlineVariant,
          display: "block",
          marginBottom: 4,
        }}
      >
        Pinned Location Map
      </span>
      <div
        style={{
          border: `2px solid ${C.black}`,
          boxShadow: `3px 3px 0px ${C.black}`,
          height: 150,
          position: "relative",
          background: C.surfaceAlt,
        }}
      >
        {mapError ? (
          <div style={{ padding: 12, fontSize: 11, color: C.errorText }}>
            Failed to load map: {mapError}
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        )}
      </div>
    </div>
  );
}

// ── Detail Modal Component ───────────────────────────────────────────────────
export default function MemoryRequestDetailModal({ request, onClose, onRefresh }) {
  const overlayRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [adminNote, setAdminNote] = useState("");

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

  async function handleApprove() {
    const confirmed = confirm("Approve this submission?\nThis will create a public memory.");
    if (!confirmed) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("You must be logged in to approve requests.");
      }

      const response = await fetch("/api/memory-requests/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: request.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Approval failed.");
      }

      alert("Memory approved successfully!");
      onRefresh();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("You must be logged in to reject requests.");
      }

      const response = await fetch("/api/memory-requests/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: request.id, adminNote }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Rejection failed.");
      }

      alert("Memory rejected and deleted from Cloudinary.");
      onRefresh();
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    try {
      const [y, m, d] = dateStr.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,17,17,0.7)",
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
          maxWidth: 900,
          maxHeight: "90vh",
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
                background:
                  request.status === "approved"
                    ? C.green
                    : request.status === "rejected"
                    ? C.pink
                    : C.yellow,
                color: C.black,
                padding: "2px 9px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {request.status}
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Review Request #{request.id}
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

        {/* Modal Scroll Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="custom-scroll">
          {errorMsg && (
            <div
              style={{
                border: `2px solid ${C.black}`,
                background: C.error,
                color: C.errorText,
                padding: "12px 16px",
                marginBottom: 20,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                boxShadow: `3px 3px 0px ${C.black}`,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: 28,
            }}
          >
            {/* Left Column: Media Preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                Media Asset ({request.type})
              </span>
              <div
                style={{
                  border: `3px solid ${C.black}`,
                  background: C.surfaceAlt,
                  boxShadow: `5px 5px 0px ${C.black}`,
                  position: "relative",
                  width: "100%",
                  minHeight: 280,
                  maxHeight: 450,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {request.type === "Photo" ? (
                  <img
                    src={request.src}
                    alt={request.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 450,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <video
                    src={request.src}
                    poster={request.thumbnail_url}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: 450,
                      display: "block",
                      background: "#000",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Metadata */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Contributor Section */}
              <div
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.blue,
                  padding: 16,
                  boxShadow: `4px 4px 0px ${C.black}`,
                }}
              >
                <h4 style={{ margin: "0 0 8px 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, textTransform: "uppercase", fontWeight: 700 }}>
                  👤 Contributor Info
                </h4>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, lineHeight: 1.5 }}>
                  <strong>Name:</strong> {request.contributor_name} <br />
                  <strong>Email:</strong> {request.contributor_email || <span style={{ color: C.outlineVariant }}>Not provided</span>}
                </div>
              </div>

              {/* Memory Details Section */}
              <div
                style={{
                  border: `2px solid ${C.black}`,
                  background: "#FFFDF8",
                  padding: 16,
                  boxShadow: `4px 4px 0px ${C.black}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <h4 style={{ margin: "0 0 4px 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, textTransform: "uppercase", fontWeight: 700 }}>
                  📝 Memory details
                </h4>

                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Title</label>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: C.black }}>
                    {request.title}
                  </span>
                </div>

                {request.description && (
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Description</label>
                    <span style={{ fontSize: 12, lineHeight: 1.5, color: C.black, whiteSpace: "pre-wrap" }}>
                      {request.description}
                    </span>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Memory Date</label>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(request.date)}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Submitted At</label>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{formatDateTime(request.created_at)}</span>
                  </div>
                </div>

                {request.location && (
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Location Name</label>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>📍 {request.location}</span>
                  </div>
                )}

                {request.latitude != null && request.longitude != null && (
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.outlineVariant, textTransform: "uppercase", display: "block" }}>Coordinates</label>
                    <span style={{ fontSize: 11, fontFamily: "monospace" }}>
                      {request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}
                    </span>
                  </div>
                )}
              </div>

              {/* Map Preview */}
              {request.latitude != null && request.longitude != null && (
                <RequestMiniMap lat={request.latitude} lng={request.longitude} />
              )}

              {/* Rejected Admin Note */}
              {request.status === "rejected" && request.admin_note && (
                <div
                  style={{
                    border: `2px solid ${C.black}`,
                    background: C.pink,
                    padding: 16,
                    boxShadow: `4px 4px 0px ${C.black}`,
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, textTransform: "uppercase", fontWeight: 700 }}>
                    ❌ Rejection Note
                  </h4>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {request.admin_note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        {request.status === "pending" && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: `3px solid ${C.black}`,
              background: C.surfaceAlt,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flexShrink: 0,
            }}
          >
            {showRejectForm ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: C.black,
                  }}
                >
                  Reason for rejection (optional, will be saved for records)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Provide an reason/note for rejecting this submission…"
                  style={{
                    width: "100%",
                    border: `2px solid ${C.black}`,
                    background: "#FFFDF8",
                    padding: "8px 12px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    outline: "none",
                    boxShadow: `3px 3px 0px ${C.black}`,
                    boxSizing: "border-box",
                    minHeight: 60,
                    resize: "vertical",
                  }}
                  disabled={loading}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    style={{
                      border: `2px solid ${C.black}`,
                      background: C.pink,
                      color: C.black,
                      padding: "8px 16px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: `3px 3px 0px ${C.black}`,
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; } }}
                    onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`; } }}
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    disabled={loading}
                    style={{
                      border: `2px solid ${C.black}`,
                      background: "#FFFDF8",
                      color: C.black,
                      padding: "8px 16px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: `3px 3px 0px ${C.black}`,
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; } }}
                    onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`; } }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: `3px solid ${C.black}`,
                    background: C.green,
                    color: C.black,
                    padding: "12px 0",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: `4px 4px 0px ${C.black}`,
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "none"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0px ${C.black}`; } }}
                >
                  {loading ? "Approving…" : "✓ Approve & Publish"}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: `3px solid ${C.black}`,
                    background: C.pink,
                    color: C.black,
                    padding: "12px 0",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: `4px 4px 0px ${C.black}`,
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "none"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0px ${C.black}`; } }}
                >
                  ✕ Reject Submission
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
