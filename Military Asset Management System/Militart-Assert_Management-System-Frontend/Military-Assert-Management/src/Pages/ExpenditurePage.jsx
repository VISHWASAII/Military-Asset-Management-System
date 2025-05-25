import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { styles } from "../Style/styleData";
import Header from "../Components/HeaderComponent";
import Sidebar from "../Components/SidebarComponent";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import { FadeLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const ExpenditurePage = () => {
  const [expenditureData, setExpenditureData] = useState([]);
  const [filteredExpenditureData, setFilteredExpenditureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const [newExpenditure, setNewExpenditure] = useState({
    baseId: "",
    assertId: "",
    quantity: ""
  });
  const [filterCriteria, setFilterCriteria] = useState({
    baseId: "",
    assertId: "",
    quantity: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchExpenditure = async () => {
      try {
        const token = Cookies.get("jwtToken");
        const response = await fetch("http://localhost:8080/expenditure/getExpenditure", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/loginPage")
        }

        const data = await response.json();
        setExpenditureData(Array.isArray(data) ? data : []);
        setFilteredExpenditureData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenditure();
  }, []);

  const fetchBasesAndAssets = async () => {
    try {
      const token = Cookies.get("jwtToken");

      // Fetch bases
      const basesResponse = await fetch("http://localhost:8080/base/getListOfBase", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!basesResponse.ok) throw new Error("Failed to fetch bases");
      const basesData = await basesResponse.json();
      setBases(basesData);

      // Fetch assets
      const assetsResponse = await fetch("http://localhost:8080/asset/getListOfAsset", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!assetsResponse.ok) throw new Error("Failed to fetch assets");
      const assetsData = await assetsResponse.json();
      setAssets(assetsData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openModal = () => {
    fetchBasesAndAssets();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewExpenditure({
      baseId: "",
      assertId: "",
      quantity: ""
    });
    setFormErrors({});
  };

  const openFilterModal = () => {
    fetchBasesAndAssets();
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
    setFilterCriteria({
      baseId: "",
      assertId: "",
      quantity: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpenditure({
      ...newExpenditure,
      [name]: value
    });
  };

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({
      ...filterCriteria,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newExpenditure.baseId) errors.baseId = "Base ID is required";
    if (!newExpenditure.assertId) errors.assertId = "Asset ID is required";
    if (!newExpenditure.quantity || isNaN(newExpenditure.quantity) || newExpenditure.quantity <= 0) {
      errors.quantity = "Valid positive quantity is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    const filtered = expenditureData.filter((expenditure) => {
      return (
        (!filterCriteria.baseId || expenditure.baseId.toString() === filterCriteria.baseId) &&
        (!filterCriteria.assertId || expenditure.assertId.toString() === filterCriteria.assertId) &&
        (!filterCriteria.quantity || expenditure.quantity.toString() === filterCriteria.quantity)
      );
    });

    setFilteredExpenditureData(filtered);
    closeFilterModal();
    toast.success("Filters applied successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = Cookies.get("jwtToken");
      const response = await fetch("http://localhost:8080/expenditure/createExpenditure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          baseId: parseInt(newExpenditure.baseId),
          assertId: parseInt(newExpenditure.assertId),
          quantity: parseInt(newExpenditure.quantity)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create expenditure");
      }

      toast.success("Expenditure created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Refresh the expenditure list
      const updatedResponse = await fetch("http://localhost:8080/expenditure/getExpenditure", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated expenditure data");
      }

      const updatedData = await updatedResponse.json();
      setExpenditureData(Array.isArray(updatedData) ? updatedData : []);
      setFilteredExpenditureData(Array.isArray(updatedData) ? updatedData : []);
      
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to create expenditure", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <FadeLoader color="black" height={15} width={5} radius={2} margin={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50, height: "100vh", alignItems: "center" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 24, backgroundColor: "#f9fafb", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "50px" }}>
            <h2 style={styles.sectionTitle}>Expenditure Details</h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={openFilterModal}
                style={{
                  backgroundColor: "#3B82F6",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                Filter
              </button>
              <button 
                onClick={openModal}
                style={{
                  backgroundColor: "#EF4444",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                + Expenditure
              </button>
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thRed }}>Expenditure ID</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Base ID</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Base Image</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Asset ID</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Asset Image</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Quantity</th>
                  <th style={{ ...styles.th, ...styles.thRed }}>Expenditure Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenditureData.length > 0 ? (
                  filteredExpenditureData.map((item) => (
                    <tr
                      key={item.id}
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>{item.id}</td>
                      <td style={styles.td}>{item.baseId}</td>
                      <td style={styles.td}>
                        <img
                          src={`/BaseImages/${item.baseId}.jpg`}
                          alt={`Base ${item.baseId}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src = "/BaseImages/default.jpg";
                          }}
                        />
                      </td>
                      <td style={styles.td}>{item.assertId}</td>
                      <td style={styles.td}>
                        <img
                          src={`/AssetImages/${item.assertId}.jpg`}
                          alt={`Asset ${item.assertId}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src = "/AssetImages/101.jpg";
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <span style={styles.textRed}>-{item.quantity}</span>
                      </td>
                      <td style={styles.td}>{item.expenditureDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={styles.emptyRow}>
                      No expenditure records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            maxWidth: '90%',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Create New Expenditure</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Base ID
            </label>
            <select
              name="baseId"
              value={newExpenditure.baseId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: formErrors.baseId ? '1px solid #EF4444' : '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">Select Base</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.id}</option>
              ))}
            </select>
            {formErrors.baseId && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.baseId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Asset ID
            </label>
            <select
              name="assertId"
              value={newExpenditure.assertId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: formErrors.assertId ? '1px solid #EF4444' : '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">Select Asset</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.id}</option>
              ))}
            </select>
            {formErrors.assertId && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.assertId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={newExpenditure.quantity}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box' 
              }}
              min="1"
            />
            {formErrors.quantity && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.quantity}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={closeModal}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#EF4444',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Create Expenditure
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={closeFilterModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            maxWidth: '90%',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '24px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Filter Expenditures</h2>
        
        <form onSubmit={handleFilterSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Base ID
            </label>
            <select
              name="baseId"
              value={filterCriteria.baseId}
              onChange={handleFilterInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">All Bases</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.id}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Asset ID
            </label>
            <select
              name="assertId"
              value={filterCriteria.assertId}
              onChange={handleFilterInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">All Assets</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.id}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={filterCriteria.quantity}
              onChange={handleFilterInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box' 
              }}
              min="1"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={closeFilterModal}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Apply Filters
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenditurePage;