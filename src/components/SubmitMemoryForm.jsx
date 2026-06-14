import { useState } from "react";
import { supabase } from "../lib/supabase";
import { uploadToCloudinary } from "../lib/cloudinary";
import LocationPicker from "./Admin/LocationPicker";

// ── Design tokens (matches existing Pasha Archive design) ────────────────────
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

// ── Accepted file types ──────────────────────────────────────────────────────
const ACCEPTED_PHOTO = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const ACCEPTED_ALL = [...ACCEPTED_PHOTO, ...ACCEPTED_VIDEO];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function SubmitMemoryForm() {
  // Contributor fields
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");

  // Memory fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Photo");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Map / file
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  }

  function validateFile(f) {
    if (!ACCEPTED_ALL.includes(f.type)) {
      return "Unsupported file type. Use JPG, PNG, WEBP, MP4, MOV, or WEBM.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File is too large (${formatFileSize(f.size)}). Maximum is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  }

  function handleFileChange(f) {
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      showToast(err, "error");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setType(f.type.startsWith("video/") ? "Video" : "Photo");
    setErrors((prev) => ({ ...prev, file: null }));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileChange(f);
  }

  function validate() {
    const errs = {};
    if (!contributorName.trim()) errs.contributorName = "Your name is required";
    if (!title.trim()) errs.title = "Title is required";
    if (!file) errs.file = "Please upload a photo or video";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setUploadProgress("Uploading media to cloud…");

    // 1. Upload to Cloudinary
    let cloudinary;
    try {
      const yearFolder = date
        ? new Date(date).getFullYear()
        : "submissions";
      cloudinary = await uploadToCloudinary(
        file,
        `pasha-archive/submissions/${yearFolder}`
      );
    } catch (err) {
      showToast("Upload failed: " + err.message, "error");
      setLoading(false);
      setUploadProgress("");
      return;
    }

    setUploadProgress("Saving your submission…");

    // 2. Build thumbnail for videos
    let thumbnailUrl = null;
    if (cloudinary.resource_type === "video") {
      thumbnailUrl = `https://res.cloudinary.com/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${cloudinary.public_id}.jpg`;
    }

    // 3. Insert into memory_requests
    const { error } = await supabase.from("memory_requests").insert({
      contributor_name: contributorName.trim(),
      contributor_email: contributorEmail.trim() || null,
      title: title.trim(),
      description: description.trim() || null,
      type,
      date: date || null,
      location: location.trim() || null,
      latitude: latitude !== "" ? Number(latitude) : null,
      longitude: longitude !== "" ? Number(longitude) : null,
      src: cloudinary.secure_url,
      thumbnail_url: thumbnailUrl,
      cloudinary_public_id: cloudinary.public_id,
      status: "pending",
    });

    setLoading(false);
    setUploadProgress("");

    if (error) {
      showToast("Failed to save submission: " + error.message, "error");
      return;
    }

    setSubmitted(true);
  }

  const hasCoords = latitude !== "" && longitude !== "";

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            border: `4px solid ${C.black}`,
            background: C.surface,
            padding: "48px 40px",
            maxWidth: 520,
            width: "100%",
            boxShadow: `10px 10px 0px ${C.black}`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Tape decoration */}
          <div
            style={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%) rotate(-3deg)",
              width: 80,
              height: 28,
              background: "rgba(254, 215, 76, 0.85)",
              zIndex: 10,
            }}
          />

          <div
            style={{
              fontSize: 56,
              marginBottom: 20,
              lineHeight: 1,
            }}
          >
            📸
          </div>

          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              margin: "0 0 12px",
              color: C.black,
            }}
          >
            Thank You!
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.7,
              color: C.onSurfaceVariant,
              margin: "0 0 8px",
            }}
          >
            Thank you for contributing to Pasha Archive.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.7,
              color: C.textSecondary,
              margin: "0 0 28px",
            }}
          >
            Your memory has been submitted and is awaiting review. We'll add it
            to the archive once it's approved.
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setContributorName("");
              setContributorEmail("");
              setTitle("");
              setDescription("");
              setType("Photo");
              setDate("");
              setLocation("");
              setLatitude("");
              setLongitude("");
              setFile(null);
              setPreview(null);
              setErrors({});
            }}
            style={{
              border: `3px solid ${C.black}`,
              background: C.yellow,
              color: C.black,
              padding: "12px 28px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
              boxShadow: `5px 5px 0px ${C.black}`,
              transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(3px,3px)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `5px 5px 0px ${C.black}`;
            }}
          >
            ＋ Submit Another
          </button>
        </div>
      </div>
    );
  }

  // ── FORM STATE ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "48px 24px 80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
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
            maxWidth: 360,
          }}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

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

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div
            style={{
              border: `3px solid ${C.black}`,
              background: C.yellow,
              padding: "8px 20px",
              boxShadow: `5px 5px 0px ${C.black}`,
              transform: "rotate(-1deg)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                margin: 0,
                color: C.black,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              Submit a Memory
            </h1>
          </div>
          <div style={{ flex: 1, height: 3, background: C.black }} />
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: C.textSecondary,
            margin: 0,
            maxWidth: 520,
          }}
        >
          Share your photos and videos with Pasha Archive. Your submission will
          be reviewed before being added to the collection.
        </p>
      </div>

      {/* ── Form Card ── */}
      <div
        style={{
          border: `3px solid ${C.black}`,
          background: C.surface,
          padding: 28,
          boxShadow: `8px 8px 0px ${C.black}`,
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* ── Section: About You ── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.pink,
                  padding: "3px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                01
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: C.black,
                }}
              >
                About You
              </span>
              <div style={{ flex: 1, height: 2, background: C.outlineVariant }} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="form-grid-2"
            >
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.contributorName ? C.errorText : C.black,
                  }}
                  placeholder="e.g. John Doe"
                  value={contributorName}
                  onChange={(e) => {
                    setContributorName(e.target.value);
                    if (errors.contributorName)
                      setErrors((p) => ({ ...p, contributorName: null }));
                  }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                {errors.contributorName && (
                  <p style={{ color: C.errorText, fontSize: 11, fontWeight: 600, marginTop: 4, margin: "4px 0 0" }}>
                    {errors.contributorName}
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Email (optional)</label>
                <input
                  type="email"
                  style={inputStyle}
                  placeholder="you@example.com"
                  value={contributorEmail}
                  onChange={(e) => setContributorEmail(e.target.value)}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {/* ── Section: Memory Details ── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.blue,
                  padding: "3px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                02
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: C.black,
                }}
              >
                Memory Details
              </span>
              <div style={{ flex: 1, height: 2, background: C.outlineVariant }} />
            </div>

            {/* Title + Type */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto",
                gap: 16,
                marginBottom: 16,
              }}
              className="form-grid-2"
            >
              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? C.errorText : C.black,
                  }}
                  placeholder="e.g. Sunset at Bromo"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((p) => ({ ...p, title: null }));
                  }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                {errors.title && (
                  <p style={{ color: C.errorText, fontSize: 11, fontWeight: 600, marginTop: 4, margin: "4px 0 0" }}>
                    {errors.title}
                  </p>
                )}
              </div>
            </div>

            {/* Date + Location */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
              className="form-grid-2"
            >
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
              </div>
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
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                placeholder="Tell us about this memory…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* ── Section: Location on Map ── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.green,
                  padding: "3px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                03
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: C.black,
                }}
              >
                Pin on Map
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  color: C.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Optional
              </span>
              <div style={{ flex: 1, height: 2, background: C.outlineVariant }} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 10,
              }}
              className="form-grid-2"
            >
              <div>
                <label style={labelStyle}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  style={{ ...inputStyle, background: hasCoords ? C.green : C.surfaceAlt }}
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
                  style={{ ...inputStyle, background: hasCoords ? C.green : C.surfaceAlt }}
                  placeholder="e.g. 112.9530"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(2px,2px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`;
                }}
              >
                📍 {hasCoords ? "Edit on Map" : "Pick on Map"}
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
                    onClick={() => {
                      setLatitude("");
                      setLongitude("");
                    }}
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

          {/* ── Section: Upload Media ── */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  border: `2px solid ${C.black}`,
                  background: C.yellow,
                  padding: "3px 10px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                04
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: C.black,
                }}
              >
                Upload Media *
              </span>
              <div style={{ flex: 1, height: 2, background: C.outlineVariant }} />
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("submit-file-input").click()}
              style={{
                border: `3px dashed ${errors.file ? C.errorText : dragOver ? C.yellow : C.black}`,
                background: dragOver ? "#FEF9E7" : C.surfaceAlt,
                cursor: "pointer",
                transition: "all 0.12s ease",
                overflow: "hidden",
                position: "relative",
                minHeight: preview ? "auto" : 140,
              }}
            >
              <input
                id="submit-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              {preview ? (
                <div style={{ position: "relative" }}>
                  {file?.type.startsWith("video/") ? (
                    <video
                      src={preview}
                      controls
                      style={{
                        width: "100%",
                        maxHeight: 260,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: 260,
                        objectFit: "cover",
                      }}
                    />
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
                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        border: "2px solid #fff",
                        padding: "6px 14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Change File
                    </span>
                  </div>

                  {/* File info badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      border: `2px solid ${C.black}`,
                      background: C.black,
                      color: C.yellow,
                      padding: "3px 8px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {type} · {formatFileSize(file.size)}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                    gap: 10,
                    pointerEvents: "none",
                  }}
                >
                  <span style={{ fontSize: 32 }}>📁</span>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: C.onSurface,
                      margin: 0,
                    }}
                  >
                    Drop your photo or video here
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      color: C.textSecondary,
                      margin: 0,
                    }}
                  >
                    JPG · PNG · WEBP · MP4 · MOV · WEBM — Max {formatFileSize(MAX_FILE_SIZE)}
                  </p>
                </div>
              )}
            </div>
            {errors.file && (
              <p style={{ color: C.errorText, fontSize: 11, fontWeight: 600, margin: "6px 0 0" }}>
                {errors.file}
              </p>
            )}
          </div>

          {/* ── Submit Button ── */}
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
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translate(3px,3px)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `5px 5px 0px ${C.yellow}`;
              }
            }}
          >
            {loading ? (
              <>
                <svg
                  width="16"
                  height="16"
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
                    opacity="0.3"
                  />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {uploadProgress}
              </>
            ) : (
              "↑ Submit Memory"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr !important; } }
        .img-overlay:hover { opacity: 1 !important; }
        div:hover > .img-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
