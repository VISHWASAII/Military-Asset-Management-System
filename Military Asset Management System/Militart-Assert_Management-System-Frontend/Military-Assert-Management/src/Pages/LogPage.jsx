import React, { useEffect, useState } from "react";
import { styles } from "../Style/styleData";
import Header from "../Components/HeaderComponent"; // adjust path if needed
import Sidebar from "../Components/SidebarComponent";
import { FadeLoader } from "react-spinners";

function AuditLogPage() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/audit/getListOfAudit")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAuditData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <FadeLoader color="black" height={15} width={5} radius={2} margin={2} />
    </div>
  );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 50,
          height: "100vh",
          alignItems: "center",
        }}
      >
        Error: {error}
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            padding: 24,
            backgroundColor: "#f9fafb",
            overflowY: "auto",
            marginTop: "40px"
          }}
        >
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Audit Logs</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, ...styles.thGray }}>ID</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>Endpoint</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>Username</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>Action</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>
                      Assignment Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditData.length > 0 ? (
                    auditData.map((log) => (
                      <tr
                        key={log.id}
                        style={styles.tr}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f9fafb")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td style={{ ...styles.td, ...styles.fontMedium }}>
                          {log.id}
                        </td>
                        <td style={styles.td}>{log.endPoint}</td>
                        <td style={styles.td}>{log.username}</td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.badge,
                              ...(log.action === "CREATE"
                                ? styles.badgeGreen
                                : log.action === "READ"
                                ? styles.badgeBlue
                                : styles.badgeGray),
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={styles.td}>{log.assignmentDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={styles.emptyRow}>
                        No audit logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogPage;
