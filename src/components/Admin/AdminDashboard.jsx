import { useState } from "react";
import { supabase } from "../../lib/supabase";
import MemoryForm from "./MemoryForm";
import MemoryTable from "./MemoryTable";
import MemoryRequestsPanel from "./MemoryRequestsPanel";

export default function AdminDashboard({ user }) {
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
    { key: "add", label: "Add Memory", icon: "＋" },
    { key: "requests", label: "Requests", icon: "📥" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F3EFE6",
        fontFamily: "'Inter', sans-serif",
        color: "#1c1b1b",
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          background: "#FFFDF8",
          borderBottom: "4px solid #1c1b1b",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            height: 60,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {/* Stamp */}
            <div
              style={{
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
                transform: "rotate(-1deg)",
              }}
            >
              CMS
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1,
                  color: "#1c1b1b",
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                Pasha Archive
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "#6B7280",
                  marginTop: 2,
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }} className="admin-desktop-nav">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
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
                    boxShadow: isActive
                      ? "2px 2px 0px #FED74C"
                      : "2px 2px 0px #1c1b1b",
                    transform: isActive ? "translate(1px,1px)" : "none",
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = "translate(2px,2px)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #1c1b1b";
                    }
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
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
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px,2px)";
              e.currentTarget.style.boxShadow = "1px 1px 0px #1c1b1b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "3px 3px 0px #1c1b1b";
            }}
          >
            ✕ Logout
          </button>
        </div>

        {/* Mobile Tabs */}
        <div
          className="admin-mobile-nav"
          style={{ borderTop: "3px solid #1c1b1b", display: "none" }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
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
                  cursor: "pointer",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── ADD MEMORY TAB ── */}
        {activeTab === "add" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>

            {/* Section Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  border: "3px solid #1c1b1b",
                  background: "#FED74C",
                  padding: "8px 20px",
                  boxShadow: "5px 5px 0px #1c1b1b",
                  transform: "rotate(-1deg)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 24,
                    margin: 0,
                    color: "#1c1b1b",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  New Memory
                </h2>
              </div>
              <div style={{ flex: 1, height: 3, background: "#1c1b1b" }} />
            </div>

            {/* Info banner */}
            <div
              style={{
                border: "2px solid #1c1b1b",
                background: "#BFD9FF",
                padding: "12px 16px",
                marginBottom: 20,
                boxShadow: "4px 4px 0px #1c1b1b",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>💡</span>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: "#1c1b1b",
                }}
              >
                Fill in the details and upload your photo. Slug is auto-generated from title.
                Toggle <strong>Featured</strong> to highlight this memory on the homepage.
              </p>
            </div>

            {/* Form Card */}
            <div
              style={{
                border: "3px solid #1c1b1b",
                background: "#FFFDF8",
                padding: "28px",
                boxShadow: "8px 8px 0px #1c1b1b",
              }}
            >
              <MemoryForm onSaved={handleMemorySaved} />
            </div>
          </div>
        )}

        {/* ── COLLECTION TAB ── */}
        {activeTab === "collection" && (
          <div>
            {/* Section Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    border: "3px solid #1c1b1b",
                    background: "#1c1b1b",
                    padding: "8px 20px",
                    boxShadow: "5px 5px 0px #FED74C",
                    transform: "rotate(0.5deg)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 24,
                      margin: 0,
                      color: "#FFFDF8",
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Collection
                  </h2>
                </div>
                <div style={{ flex: 1, height: 3, background: "#1c1b1b", minWidth: 40 }} />
              </div>

              <button
                onClick={() => setActiveTab("add")}
                style={{
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
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(3px,3px)";
                  e.currentTarget.style.boxShadow = "1px 1px 0px #1c1b1b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "4px 4px 0px #1c1b1b";
                }}
              >
                ＋ Add New
              </button>
            </div>

            {/* Table Card */}
            <div
              style={{
                border: "3px solid #1c1b1b",
                background: "#FFFDF8",
                padding: "24px",
                boxShadow: "8px 8px 0px #1c1b1b",
              }}
            >
              <MemoryTable refreshKey={refreshKey} />
            </div>
          </div>
        )}

        {/* ── REQUESTS TAB ── */}
        {activeTab === "requests" && (
          <div>
            {/* Section Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    border: "3px solid #1c1b1b",
                    background: "#1c1b1b",
                    padding: "8px 20px",
                    boxShadow: "5px 5px 0px #FED74C",
                    transform: "rotate(-0.5deg)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 24,
                      margin: 0,
                      color: "#FFFDF8",
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Requests
                  </h2>
                </div>
                <div style={{ flex: 1, height: 3, background: "#1c1b1b", minWidth: 40 }} />
              </div>
            </div>

            {/* Table Card */}
            <div
              style={{
                border: "3px solid #1c1b1b",
                background: "#FFFDF8",
                padding: "24px",
                boxShadow: "8px 8px 0px #1c1b1b",
              }}
            >
              <MemoryRequestsPanel />
            </div>
          </div>
        )}

      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-nav { display: none !important; }
          .admin-mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}