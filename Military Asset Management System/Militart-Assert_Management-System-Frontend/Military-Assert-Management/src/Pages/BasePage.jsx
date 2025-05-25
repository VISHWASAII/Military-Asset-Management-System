import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { styles } from "../Style/styleData";
import Header from "../Components/HeaderComponent";   // Adjust import paths if needed
import Sidebar from "../Components/SidebarComponent";
import { FadeLoader } from "react-spinners";
import { Navigate, useNavigate } from 'react-router-dom';
import { UserMinus } from "react-feather";

function BasePage() {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBases = async () => {
      try {
        const token = Cookies.get("jwtToken");

        const response = await fetch(
          "http://localhost:8080/base/getListOfBase",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          navigate("/loginPage")
        }

        const data = await response.json();
        setBases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBases();
  }, []);

  if (loading){
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <FadeLoader color="black" height={15} width={5} radius={2} margin={2} />
    </div>
  );
  }
  if (error) return <div>Error: {error}</div>;
  if (!bases.length) return <div>No bases found.</div>;

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
            <h2 style={styles.sectionTitle}>Base List</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, ...styles.thGray }}>Base ID</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>Base Name</th>
                    <th style={{ ...styles.th, ...styles.thGray }}>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {bases.map((base) => (
                    <tr key={base.id} style={styles.tr}>
                      <td style={styles.td}>{base.id}</td>
                      <td style={styles.td}>{base.name}</td>
                      <td style={styles.td}>
                        <img
                          src={`/BaseImages/${base.id}.jpg`}
                          alt={`Base ${base.id}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src = "/default.jpg"; // fallback image if not found
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasePage;
