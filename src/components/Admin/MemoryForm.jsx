import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { uploadToCloudinary } from "../../lib/cloudinary";

// ── Design tokens from DESIGN.md ──
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

export default function MemoryForm({ onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [type, setType] = useState("Photo");

  const [tags, setTags] = useState([]);
  const [people, setPeople] = useState([]);

  const [newTag, setNewTag] = useState("");
  const [newPerson, setNewPerson] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
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

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleFileChange(f) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (f.type.startsWith("video/")) {
      setType("Video");
    } else {
      setType("Photo");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/"))) {
      handleFileChange(f);
    }
  }

  async function createTag() {
    const tagValue = newTag.trim();
    if (!tagValue) {
      showToast("Tag cannot be empty", "error");
      return;
    }

    const { error } = await supabase.from("tags").insert({ tag: tagValue });
    if (error) {
      showToast(error.message, "error");
      return;
    }

    setNewTag("");
    showToast(`Tag '${tagValue}' added`);
    await loadTags();
  }

  async function createPerson() {
    const personValue = newPerson.trim();
    if (!personValue) {
      showToast("Person name cannot be empty", "error");
      return;
    }

    const { error } = await supabase.from("people").insert({ name: personValue });
    if (error) {
      showToast(error.message, "error");
      return;
    }

    setNewPerson("");
    showToast(`Person '${personValue}' added`);
    await loadPeople();
  }

  async function deleteTag(tagId) {
    if (!window.confirm("Delete this tag? This will remove it from the list.")) {
      return;
    }

    await supabase.from("memory_tags").delete().eq("tag_id", tagId);
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) {
      showToast(error.message, "error");
      return;
    }

    setSelectedTags(selectedTags.filter((id) => id !== tagId));
    showToast("Tag deleted");
    await loadTags();
  }

  async function deletePerson(personId) {
    if (!window.confirm("Delete this person? This will remove them from the list.")) {
      return;
    }

    await supabase.from("memory_people").delete().eq("person_id", personId);
    const { error } = await supabase.from("people").delete().eq("id", personId);
    if (error) {
      showToast(error.message, "error");
      return;
    }

    setSelectedPeople(selectedPeople.filter((id) => id !== personId));
    showToast("Person deleted");
    await loadPeople();
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
      cloudinary = await uploadToCloudinary(
        file,
        `pasha-archive/${yearFolder}`,
      );
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
      return;
    }

    let thumbnail = null;

    if (cloudinary.resource_type === "video") {
      thumbnail = `https://res.cloudinary.com/${
        import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
      }/video/upload/so_1/${cloudinary.public_id}.jpg`;
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
        src: cloudinary.secure_url,
        cloudinary_public_id: cloudinary.public_id,
        thumbnail_url: thumbnail,
        featured,
      })
      .select()
      .single();

    // ── Link Tags ──
    if (selectedTags.length > 0 && memory) {
      const { error: tagError } = await supabase.from("memory_tags").insert(
        selectedTags.map((tagId) => ({
          memory_id: memory.id,
          tag_id: tagId,
        })),
      );

      if (tagError) {
        console.error("Error linking tags:", tagError);
      }
    }

    // ── Link People ──
    if (selectedPeople.length > 0 && memory) {
      const { error: peopleError } = await supabase
        .from("memory_people")
        .insert(
          selectedPeople.map((personId) => ({
            memory_id: memory.id,
            person_id: personId,
          })),
        );

      if (peopleError) {
        console.error("Error linking people:", peopleError);
      }
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
    setDate("");
    setFeatured(false);
    setFile(null);
    setPreview(null);
    if (onSaved) onSaved();
  }

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

      <form onSubmit={handleSubmit}>
        {/* Row 1: Title + Date */}
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
            <label style={labelStyle}>Title *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Sunset at Bromo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              style={inputStyle}
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

        {/* Row 2: Location + Featured */}
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
            <label style={labelStyle}>Location</label>
            <input
              style={inputStyle}
              placeholder="e.g. Bromo, East Java"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(2px,2px)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `3px 3px 0px ${C.black}`;
              }}
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
                  <span
                    style={{
                      color: C.yellow,
                      fontSize: 10,
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </span>
              {featured ? "⭐ Featured" : "Mark as Featured"}
            </button>
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

        <div
          style={{
            border: `2px dashed ${C.black}`,
            padding: 16,
            background: C.surfaceAlt,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <label style={labelStyle}>Add Person</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder="Person name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={createPerson}
                  style={{
                    border: `2px solid ${C.black}`,
                    background: C.blue,
                    color: C.black,
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "3px 3px 0px #000",
                  }}
                >
                  ＋
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Add Tag</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tag name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={createTag}
                  style={{
                    border: `2px solid ${C.black}`,
                    background: C.yellow,
                    color: C.black,
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "3px 3px 0px #000",
                  }}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <div style={{ marginBottom: 10, fontWeight: 700, color: C.onSurfaceVariant }}>
                People list
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {people.map((person) => (
                  <div
                    key={person.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: `2px solid ${C.black}`,
                      padding: "8px 12px",
                      background: C.surface,
                    }}
                  >
                    <span>{person.name}</span>
                    <button
                      type="button"
                      onClick={() => deletePerson(person.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        color: C.black,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 10, fontWeight: 700, color: C.onSurfaceVariant }}>
                Tag list
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: `2px solid ${C.black}`,
                      padding: "8px 12px",
                      background: C.surface,
                    }}
                  >
                    <span>{tag.tag}</span>
                    <button
                      type="button"
                      onClick={() => deleteTag(tag.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: 700,
                        color: C.black,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>People</label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {people.map((person) => {
              const active = selectedPeople.includes(person.id);

              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSelectedPeople(
                        selectedPeople.filter((id) => id !== person.id),
                      );
                    } else {
                      setSelectedPeople([...selectedPeople, person.id]);
                    }
                  }}
                  style={{
                    border: `2px solid ${C.black}`,
                    background: active ? C.blue : C.surface,
                    color: C.black,
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: active
                      ? `2px 2px 0px ${C.black}`
                      : `4px 4px 0px ${C.black}`,
                    transform: active ? "translate(2px,2px)" : "none",
                    transition: "all .12s ease",
                  }}
                >
                  {active ? "✓ " : ""}
                  {person.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Tags</label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSelectedTags(
                        selectedTags.filter((id) => id !== tag.id),
                      );
                    } else {
                      setSelectedTags([...selectedTags, tag.id]);
                    }
                  }}
                  style={{
                    border: `2px solid ${C.black}`,
                    background: active ? C.yellow : C.surface,
                    color: C.black,
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: active
                      ? `2px 2px 0px ${C.black}`
                      : `4px 4px 0px ${C.black}`,
                    transform: active ? "translate(2px,2px)" : "none",
                    transition: "all .12s ease",
                  }}
                >
                  {active ? "✓ " : ""}
                  {tag.tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Drop Zone */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Image *</label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
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
                  <video
                    src={preview}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                    }}
                  />
                )}
                <div
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
                  className="img-overlay"
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
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 32,
                  gap: 8,
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 36 }}>📷</span>
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
                  Drop image here or click to browse
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: C.textSecondary,
                    margin: 0,
                  }}
                >
                  PNG · JPG · WEBP
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
              Uploading...
            </>
          ) : (
            "↑ Upload Memory"
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
        .img-overlay:hover { opacity: 1 !important; }
        div:hover > .img-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
