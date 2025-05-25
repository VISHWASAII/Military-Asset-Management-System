import React, { useState } from 'react';
import Typewriter from "typewriter-effect";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const signIn = async (username, password) => {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await signIn(formData.username, formData.password);
      Cookies.set('jwtToken', token, { expires: 1, secure: true });
      window.location.href = '/dashboardPage';
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "5px",
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "Roboto",
      }}
    >
      <div style={{ paddingTop: "80px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "Roboto",
            fontSize: "20px",
            fontWeight: "600",
            color: "#000",
            padding: "10px",
          }}
        >
          <Typewriter
            onInit={(typewriter) => {
              typewriter.typeString("Welcome to MAM").start();
            }}
            options={{
              autoStart: true,
              loop: false,
              delay: 50,
            }}
          />
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #AEAEAE",
            width: "400px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
          }}
        >
          <form onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "10px 0",
                color: "#666",
              }}
            >
              <hr style={{ flexGrow: 1, borderColor: "#e2e8f0" }} />
              <span style={{ margin: "0 15px", fontSize: "16px", fontWeight: "500" }}>
                Sign in to your account
              </span>
              <hr style={{ flexGrow: 1, borderColor: "#e2e8f0" }} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <input
                name='username'
                type="text"
                placeholder="Username"
                style={{
                  width: "300px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                style={{
                  width: "300px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                onChange={handleChange}
              />
              <button
                type="submit"
                style={{
                  width: "315px",
                  padding: "10px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                View username & password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h3>Sample Credentials</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#888"
                }}
              >
                ×
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Password</th>
                  <th style={thStyle}>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>admin</td>
                  <td style={tdStyle}>Admin123!</td>
                  <td style={tdStyle}>ROLE_ADMIN</td>
                </tr>
                <tr>
                  <td style={tdStyle}>commander1</td>
                  <td style={tdStyle}>Commander123!</td>
                  <td style={tdStyle}>ROLE_BASE_COMMANDER</td>
                </tr>
                <tr>
                  <td style={tdStyle}>logistics1</td>
                  <td style={tdStyle}>Logistics123!</td>
                  <td style={tdStyle}>ROLE_LOGISTICS_OFFICER</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  padding: "8px",
  backgroundColor: "#f0f0f0"
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px"
};
