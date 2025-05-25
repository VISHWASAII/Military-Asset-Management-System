import React, { useState } from "react";
import { Shield, Target, Users, Package, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MilitaryLandingPage = () => {
  const navigate = useNavigate();
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleGetStarted = () => {
    navigate("/loginPage"); 
  };

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "clamp(16px, 4vw, 20px)",
              color: "#111827",
            }}
          >
            <Shield
              style={{ height: 32, width: 32, color: "#2563eb", marginRight: 8 }}
            />
            Military Asset Management
          </div>
          <nav style={{ display: "flex", gap: "clamp(12px, 2vw, 24px)" }}>
            <a
              href="#"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "clamp(12px, 2vw, 16px)",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
              onClick={toggleAboutModal}
            >
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "clamp(40px, 10vw, 80px) 16px",
          textAlign: "center",
          maxWidth: 640,
          margin: "0 auto",
          width: "90%",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: "700",
            marginBottom: 24,
            color: "#111827",
            lineHeight: 1.1,
          }}
        >
          Secure Military Asset Management System
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 3vw, 20px)",
            color: "#4b5563",
            marginBottom: 32,
          }}
        >
          Comprehensive tracking and management of military assets with
          enterprise-grade security and real-time operational visibility.
        </p>
        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: "clamp(14px, 3vw, 18px)",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 15px rgba(37, 99, 235, 0.3)",
            transition: "background-color 0.3s ease",
            minWidth: "150px",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section
        style={{
          maxWidth: 980,
          margin: "clamp(32px, 6vw, 64px) auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "clamp(16px, 4vw, 32px)",
          padding: "0 16px",
          width: "90%",
        }}
      >
        <div
          style={{
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: 8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "9999px",
              width: "clamp(48px, 8vw, 64px)",
              height: "clamp(48px, 8vw, 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "clamp(12px, 3vw, 24px)",
              backgroundColor: "#bfdbfe",
              color: "#2563eb",
            }}
          >
            <Package color="#2563eb" size="clamp(24px, 4vw, 32px)" />
          </div>
          <h3
            style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "clamp(8px, 2vw, 16px)",
            }}
          >
            Asset Tracking
          </h3>
          <p style={{ color: "#4b5563", lineHeight: 1.6, fontSize: "clamp(14px, 2vw, 16px)" }}>
            Real-time tracking of weapons, equipment, and supplies with precise
            location data and status monitoring across all military
            installations.
          </p>
        </div>

        <div
          style={{
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: 8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "9999px",
              width: "clamp(48px, 8vw, 64px)",
              height: "clamp(48px, 8vw, 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "clamp(12px, 3vw, 24px)",
              backgroundColor: "#bbf7d0",
              color: "#22c55e",
            }}
          >
            <Target color="#22c55e" size="clamp(24px, 4vw, 32px)" />
          </div>
          <h3
            style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "clamp(8px, 2vw, 16px)",
            }}
          >
            Security Management
          </h3>
          <p style={{ color: "#4b5563", lineHeight: 1.6, fontSize: "clamp(14px, 2vw, 16px)" }}>
            Military-grade encryption and access control ensuring classified
            assets remain secure with comprehensive audit trails and compliance
            reporting.
          </p>
        </div>

        <div
          style={{
            padding: "clamp(16px, 3vw, 32px)",
            borderRadius: 8,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              borderRadius: "9999px",
              width: "clamp(48px, 8vw, 64px)",
              height: "clamp(48px, 8vw, 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "clamp(12px, 3vw, 24px)",
              backgroundColor: "#e9d5ff",
              color: "#7c3aed",
            }}
          >
            <Users color="#7c3aed" size="clamp(24px, 4vw, 32px)" />
          </div>
          <h3
            style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "clamp(8px, 2vw, 16px)",
            }}
          >
            Personnel Control
          </h3>
          <p style={{ color: "#4b5563", lineHeight: 1.6, fontSize: "clamp(14px, 2vw, 16px)" }}>
            Manage asset assignments to personnel with clearance verification,
            responsibility tracking, and automated transfer protocols.
          </p>
        </div>
      </section>

      {/* Footer - full width */}
      <footer
        style={{
          backgroundColor: "#111827",
          color: "#d1d5db",
          padding: "clamp(24px, 6vw, 48px) 16px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "clamp(16px, 4vw, 32px)",
            padding: "0 16px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                color: "#60a5fa",
                fontWeight: 700,
                fontSize: "clamp(16px, 3vw, 20px)",
              }}
            >
              <Shield
                style={{
                  width: "clamp(20px, 4vw, 24px)",
                  height: "clamp(20px, 4vw, 24px)",
                  marginRight: 8,
                }}
              />
              MAMS
            </div>
            <p style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>Secure military asset management system</p>
          </div>

          <div>
            <h4
              style={{
                fontWeight: 600,
                marginBottom: 16,
                color: "white",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              Contact Me
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: "#9ca3af", fontSize: "clamp(12px, 2vw, 14px)" }}>
                  Name: Saivishwa
                </span>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a
                  href="mailto:saivishwasai202@gmail.com"
                  style={{
                    color: "#9ca3af",
                    textDecoration: "none",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "white")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  Email: saivishwasai202@gmail.com
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: "#9ca3af", fontSize: "clamp(12px, 2vw, 14px)" }}>
                  Phone: +91 8300106509
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontWeight: 600,
                marginBottom: 16,
                color: "white",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              Education Details
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {["Vellore Institute Of Technology", "M.tech Software Engineering", "Vellore"].map((item) => (
                <li key={item} style={{ marginBottom: 8 }}>
                  <a
                    href="#"
                    style={{
                      color: "#9ca3af",
                      textDecoration: "none",
                      fontSize: "clamp(12px, 2vw, 14px)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "white")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={toggleAboutModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              padding: 32,
              maxWidth: 500,
              width: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4b5563",
              }}
              onClick={toggleAboutModal}
            >
              <X size={24} />
            </button>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 24,
                color: "#111827",
              }}
            >
              About Me
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "max-content 1fr",
                gap: "16px 8px",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 500 }}>Name:</span>
              <span>Saivishwa</span>

              <span style={{ fontWeight: 500 }}>Email:</span>
              <a
                href="mailto:saivishwasai202@gmail.com"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                saivishwasai202@gmail.com
              </a>

              <span style={{ fontWeight: 500 }}>College:</span>
              <span>Vellore Institute of Technology</span>

              <span style={{ fontWeight: 500 }}>Degree:</span>
              <span>M.Tech Software Engineering</span>

              <span style={{ fontWeight: 500 }}>Mobile Number:</span>
              <span>+91 8300106509</span>

              <span style={{ fontWeight: 500 }}>Project Frontend:</span>
              <span>React</span>

              <span style={{ fontWeight: 500 }}>Project Backend:</span>
              <span>Spring Boot</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilitaryLandingPage;