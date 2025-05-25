import React, { useEffect, useState } from "react";
import { styles } from "../Style/styleData";
import Cookies from "js-cookie";
import Header from "../Components/HeaderComponent";
import Sidebar from "../Components/SidebarComponent";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const TransferPage = () => {
  const [transferInDetails, setTransferInDetails] = useState([]);
  const [filteredTransferInDetails, setFilteredTransferInDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [bases, setBases] = useState([]);
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [newTransfer, setNewTransfer] = useState({
    fromBaseId: "",
    toBaseId: "",
    assertId: "",
    quantity: ""
  });
  const [filterCriteria, setFilterCriteria] = useState({
    fromBaseId: "",
    toBaseId: "",
    assertId: "",
    quantity: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const token = Cookies.get("jwtToken");
        const response = await fetch("http://localhost:8080/transfer/getTransfer", {
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
        console.log("Fetched transfer data:", data); // Debug: Log the API response
        setTransferInDetails(Array.isArray(data) ? data : []);
        setFilteredTransferInDetails(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
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
      console.log("Fetched assets:", assetsData); // Debug: Log the assets response
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
    setNewTransfer({
      fromBaseId: "",
      toBaseId: "",
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
      fromBaseId: "",
      toBaseId: "",
      assertId: "",
      quantity: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransfer({
      ...newTransfer,
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
    if (!newTransfer.fromBaseId) errors.fromBaseId = "From Base ID is required";
    if (!newTransfer.toBaseId) errors.toBaseId = "To Base ID is required";
    if (newTransfer.fromBaseId === newTransfer.toBaseId && newTransfer.fromBaseId) {
      errors.toBaseId = "To Base ID must be different from From Base ID";
    }
    if (!newTransfer.assertId) errors.assertId = "Asset ID is required";
    if (!newTransfer.quantity || isNaN(newTransfer.quantity) || newTransfer.quantity <= 0) {
      errors.quantity = "Valid positive quantity is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    const filtered = transferInDetails.filter((transfer) => {
      return (
        (!filterCriteria.fromBaseId || transfer.fromBaseId.toString() === filterCriteria.fromBaseId) &&
        (!filterCriteria.toBaseId || transfer.toBaseId.toString() === filterCriteria.toBaseId) &&
        (!filterCriteria.assertId || (transfer.assertId && transfer.assertId.toString() === filterCriteria.assertId)) &&
        (!filterCriteria.quantity || (transfer.quantity && transfer.quantity.toString() === filterCriteria.quantity))
      );
    });

    console.log("Filtered transfer data:", filtered); // Debug: Log filtered data
    setFilteredTransferInDetails(filtered);
    closeFilterModal();
    toast.success("Filters applied successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = Cookies.get("jwtToken");
      const response = await fetch("http://localhost:8080/transfer/addTransfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          fromBaseId: parseInt(newTransfer.fromBaseId),
          toBaseId: parseInt(newTransfer.toBaseId),
          assertId: parseInt(newTransfer.assertId),
          quantity: parseInt(newTransfer.quantity)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create transfer");
      }

      toast.success("Transfer created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Refresh the transfer list
      const updatedResponse = await fetch("http://localhost:8080/transfer/getTransfer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated transfer data");
      }

      const updatedData = await updatedResponse.json();
      console.log("Updated transfer data:", updatedData); // Debug: Log the updated data
      setTransferInDetails(Array.isArray(updatedData) ? updatedData : []);
      setFilteredTransferInDetails(Array.isArray(updatedData) ? updatedData : []);
      
      closeModal();
    } catch (err) {
      const errorMessage = err.message || "Failed to create transfer";
      if (errorMessage.toLowerCase().includes("not enough stock")) {
        Swal.fire({
          icon: "error",
          title: "Insufficient Quantity",
          text: "Not enough stock at source base",
          confirmButtonColor: "#3B82F6",
        });
      } else {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
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
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50, height: "100vh", alignItems: "center", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  // Debug: Log the data being rendered in the table
  console.log("Rendering table with filtered data:", filteredTransferInDetails);

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
            <h2 style={styles.sectionTitle}>Transfer In Details</h2>
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
                + Transfer
              </button>
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Transfer ID</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>From Base</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>FromBase Image</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>To Base</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>ToBase Image</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Asset ID</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Asset Image</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Quantity</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Transfer Date</th>
                  <th style={{ ...styles.th, ...styles.thBlue }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransferInDetails.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={styles.emptyRow}>
                      No transfer in records found
                    </td>
                  </tr>
                ) : (
                  filteredTransferInDetails.map((transfer) => (
                    <tr
                      key={transfer.id}
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>{transfer.id || 'N/A'}</td>
                      <td style={styles.td}>{transfer.fromBaseId || 'N/A'}</td>
                      <td style={styles.td}>
                        <img
                          src={`/BaseImages/${transfer.fromBaseId || 'default'}.jpg`}
                          alt={`From Base ${transfer.fromBaseId || 'N/A'}`}
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
                      <td style={styles.td}>{transfer.toBaseId || 'N/A'}</td>
                      <td style={styles.td}>
                        <img
                          src={`/BaseImages/${transfer.toBaseId || 'default'}.jpg`}
                          alt={`To Base ${transfer.toBaseId || 'N/A'}`}
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
                      <td style={{ ...styles.td, color: '#000000', visibility: 'visible', opacity: 1 }}>
                        {transfer.assertId ? transfer.assertId : 'N/A'}
                      </td>
                      <td style={styles.td}>
                        <img
                          src={`/AssetImages/${transfer.assertId || 'default'}.jpg`}
                          alt={`Asset ${transfer.assertId || 'N/A'}`}
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
                        <span style={styles.textBlue}>+{transfer.quantity || 'N/A'}</span>
                      </td>
                      <td style={styles.td}>{transfer.transferDate || 'N/A'}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeBlue }}>
                          Transfer In
                        </span>
                      </td>
                    </tr>
                  ))
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
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Create New Transfer</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              From Base ID
            </label>
            <select
              name="fromBaseId"
              value={newTransfer.fromBaseId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: formErrors.fromBaseId ? '1px solid #EF4444' : '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">Select From Base</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.id}</option>
              ))}
            </select>
            {formErrors.fromBaseId && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.fromBaseId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              To Base ID
            </label>
            <select
              name="toBaseId"
              value={newTransfer.toBaseId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: formErrors.toBaseId ? '1px solid #EF4444' : '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">Select To Base</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.id}</option>
              ))}
            </select>
            {formErrors.toBaseId && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.toBaseId}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Asset ID
            </label>
            <select
              name="assertId"
              value={newTransfer.assertId}
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
              value={newTransfer.quantity}
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
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Create Transfer
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
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Filter Transfers</h2>
        
        <form onSubmit={handleFilterSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              From Base ID
            </label>
            <select
              name="fromBaseId"
              value={filterCriteria.fromBaseId}
              onChange={handleFilterInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">All From Bases</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.id}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              To Base ID
            </label>
            <select
              name="toBaseId"
              value={filterCriteria.toBaseId}
              onChange={handleFilterInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            >
              <option value="">All To Bases</option>
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
                outline: 'none'
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

export default TransferPage;