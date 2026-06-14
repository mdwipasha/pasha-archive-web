import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import MemoryRequestDetailModal from "./MemoryRequestDetailModal";

const C = {
  black: "#111111",
  surface: "#FFFDF8",
  surfaceAlt: "#ECE6D8",
  outline: "#747878",
  outlineVariant: "#c4c7c7",
  yellow: "#FED74C",
  blue: "#BFD9FF",
  pink: "#F6D1D8",
  green: "#C8F0B0",
};

export default function MemoryRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function loadRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("memory_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading requests:", error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, [refreshKey]);

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  function getStatusStyle(status) {
    switch (status) {
      case "approved":
        return { bg: C.green, text: "#1b431c" };
      case "rejected":
        return { bg: C.pink, text: "#7a0000" };
      case "pending":
      default:
        return { bg: C.yellow, text: "#604b00" };
    }
  }

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  function formatDate(dateTimeStr) {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateTimeStr;
    }
  }

  return (
    <div>
      {/* ── Filter Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `2px solid ${C.outlineVariant}`,
        }}
      >
        {/* Filter buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { key: "all", label: "All Submissions" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  border: `2px solid ${C.black}`,
                  background: isActive ? C.black : C.surface,
                  color: isActive ? "#fff" : C.black,
                  padding: "6px 14px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  boxShadow: isActive ? `2px 2px 0px ${C.yellow}` : `2px 2px 0px ${C.black}`,
                  transform: isActive ? "translate(1px, 1px)" : "none",
                  transition: "all 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = "translate(1px, 1px)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = `2px 2px 0px ${C.black}`;
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Count display */}
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
            {filteredRequests.length}
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#6B7280",
            }}
          >
            of {requests.length} total requests
          </span>
        </div>
      </div>

      {/* ── Loading Spinner ── */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0",
            gap: 12,
            color: "#6B7280",
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
            Loading requests…
          </span>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredRequests.length === 0 && (
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
          <span style={{ fontSize: 48 }}>📥</span>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: C.black,
              margin: 0,
            }}
          >
            No submissions found
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
            {filter === "all"
              ? "No community memories have been submitted yet."
              : `There are no requests with "${filter}" status.`}
          </p>
        </div>
      )}

      {/* ── Grid List ── */}
      {!loading && filteredRequests.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {filteredRequests.map((req) => {
            const statusTheme = getStatusStyle(req.status);
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                style={{
                  border: `3px solid ${C.black}`,
                  background: C.surface,
                  boxShadow: `5px 5px 0px ${C.black}`,
                  overflow: "hidden",
                  transition: "all 0.12s ease",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(3px, 3px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `5px 5px 0px ${C.black}`;
                }}
              >
                {/* Media preview */}
                <div
                  style={{
                    position: "relative",
                    height: 160,
                    borderBottom: `3px solid ${C.black}`,
                    background: C.surfaceAlt,
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {req.type === "Photo" ? (
                    <img
                      src={req.src}
                      alt={req.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      <img
                        src={req.thumbnail_url}
                        alt={req.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <span style={{ fontSize: 28 }}>▶️</span>
                      </div>
                    </div>
                  )}

                  {/* Type badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      border: `2px solid ${C.black}`,
                      background: C.blue,
                      color: C.black,
                      padding: "2px 6px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      boxShadow: `1.5px 1.5px 0px ${C.black}`,
                    }}
                  >
                    {req.type}
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      border: `2px solid ${C.black}`,
                      background: statusTheme.bg,
                      color: C.black,
                      padding: "2px 8px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      boxShadow: `1.5px 1.5px 0px ${C.black}`,
                    }}
                  >
                    {req.status}
                  </div>
                </div>

                {/* Info Content */}
                <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#6B7280",
                    }}
                  >
                    By {req.contributor_name}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      margin: "4px 0 8px 0",
                      color: C.black,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {req.title}
                  </h3>

                  <div style={{ marginTop: "auto", borderTop: `1px dashed ${C.outlineVariant}`, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#6B7280" }}>
                      Submitted:
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.black, fontFamily: "'Inter', sans-serif" }}>
                      {formatDate(req.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <MemoryRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onRefresh={handleRefresh}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
