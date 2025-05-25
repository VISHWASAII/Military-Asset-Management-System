import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { styles } from "../Style/styleData";
import Header from "../Components/HeaderComponent";
import Sidebar from "../Components/SidebarComponent";
import { FadeLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { Navigate, useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function AssignmentPage() {
  const [assignmentDetails, setAssignmentDetails] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const [newAssignment, setNewAssignment] = useState({
    baseId: "",
    assertId: "",
    personnelId: "",
    quantity: ""
  });
  const [filterCriteria, setFilterCriteria] = useState({
    baseId: "",
    assertId: "",
    personnelId: "",
    quantity: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const token = Cookies.get("jwtToken");
        const response = await fetch(
          "http://localhost:8080/assignment/getAssignment",
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
        setAssignmentDetails(Array.isArray(data) ? data : []);
        setFilteredAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const token = Cookies.get("jwtToken");
      
      const basesResponse = await fetch("http://localhost:8080/base/getListOfBase", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      
      const assetsResponse = await fetch("http://localhost:8080/asset/getListOfAsset", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!basesResponse.ok || !assetsResponse.ok) {
        throw new Error("Failed to fetch dropdown data");
      }

      const basesData = await basesResponse.json();
      const assetsData = await assetsResponse.json();

      setBases(basesData);
      setAssets(assetsData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const isAsc = prevConfig.key === key && prevConfig.direction === 'asc';
      return {
        key,
        direction: isAsc ? 'desc' : 'asc'
      };
    });

    setFilteredAssignments((prevDetails) => {
      const sortedDetails = [...prevDetails];
      sortedDetails.sort((a, b) => {
        if (key === 'assignmentDate') {
          const dateA = new Date(a[key]);
          const dateB = new Date(b[key]);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sortedDetails;
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const openModal = () => {
    fetchDropdownData();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewAssignment({
      baseId: "",
      assertId: "",
      personnelId: "",
      quantity: ""
    });
    setFormErrors({});
  };

  const openFilterModal = () => {
    fetchDropdownData();
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
    setFilterCriteria({
      baseId: "",
      assertId: "",
      personnelId: "",
      quantity: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
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
    if (!newAssignment.baseId) errors.baseId = "Base ID is required";
    if (!newAssignment.assertId) errors.assertId = "Asset ID is required";
    if (!newAssignment.personnelId) errors.personnelId = "Personnel ID is required";
    if (!newAssignment.quantity || isNaN(newAssignment.quantity)) errors.quantity = "Valid quantity is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    const filtered = assignmentDetails.filter((assignment) => {
      return (
        (!filterCriteria.baseId || assignment.baseId.toString() === filterCriteria.baseId) &&
        (!filterCriteria.assertId || assignment.assertId.toString() === filterCriteria.assertId) &&
        (!filterCriteria.personnelId || assignment.personnelId.toString() === filterCriteria.personnelId) &&
        (!filterCriteria.quantity || assignment.quantity.toString() === filterCriteria.quantity)
      );
    });

    setFilteredAssignments(filtered);
    closeFilterModal();
    toast.success("Filters applied successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = Cookies.get("jwtToken");
      const response = await fetch("http://localhost:8080/assignment/createAssignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          baseId: parseInt(newAssignment.baseId),
          assertId: parseInt(newAssignment.assertId),
          personnelId: parseInt(newAssignment.personnelId),
          quantity: parseInt(newAssignment.quantity)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      toast.success("Assignment created successfully!");

      const updatedResponse = await fetch(
        "http://localhost:8080/assignment/getAssignment",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated assignment data");
      }

      const updatedData = await updatedResponse.json();
      setAssignmentDetails(Array.isArray(updatedData) ? updatedData : []);
      setFilteredAssignments(Array.isArray(updatedData) ? updatedData : []);
      
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to create assignment");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <FadeLoader color="black" height={15} width={5} radius={2} margin={2} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            padding: "24px",
            backgroundColor: "#f9fafb",
            overflowY: "auto",
            marginTop: "40px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={styles.sectionTitle}>Assignment Details</h2>
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
                  backgroundColor: "#10B981",
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
                + New Assignment
              </button>
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('id')}>
                    Assignment ID{getSortIndicator('id')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('baseId')}>
                    Base ID{getSortIndicator('baseId')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('assertId')}>
                    Asset ID{getSortIndicator('assertId')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('personnelId')}>
                    Personnel ID{getSortIndicator('personnelId')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('quantity')}>
                    Quantity{getSortIndicator('quantity')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale, cursor: 'pointer' }} onClick={() => handleSort('assignmentDate')}>
                    Assignment Date{getSortIndicator('assignmentDate')}
                  </th>
                  <th style={{ ...styles.th, ...styles.thTale }}>Base Image</th>
                  <th style={{ ...styles.th, ...styles.thTale }}>Action</th>
                  <th style={{ ...styles.th, ...styles.thTale }}>Asset Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      style={styles.tr}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>
                        {assignment.id}
                      </td>
                      <td style={styles.td}>{assignment.baseId}</td>
                      <td style={styles.td}>{assignment.assertId}</td>
                      <td style={styles.td}>{assignment.personnelId}</td>
                      <td style={styles.td}>{assignment.quantity}</td>
                      <td style={styles.td}>{assignment.assignmentDate}</td>
                      <td style={styles.td}>
                        <img
                          src={`/BaseImages/${assignment.baseId}.jpg`}
                          alt={`Base ${assignment.baseId}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src = "default.jpg";
                          }}
                        />
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeGreen }}>
                          Assigned
                        </span>
                      </td>
                      <td style={styles.td}>
                        <img
                          src={`/AssetImages/${assignment.assertId}.jpg`}
                          alt={`Asset ${assignment.assertId}`}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={styles.emptyRow}>
                      No assignment records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for new assignment */}
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
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Create New Assignment</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Base ID
            </label>
            <select
              name="baseId"
              value={newAssignment.baseId}
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
              value={newAssignment.assertId}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Personnel ID
            </label>
            <input
              type="number"
              name="personnelId"
              value={newAssignment.personnelId}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box' 
              }}
            />
            {formErrors.personnelId && (
              <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '4px' }}>
                {formErrors.personnelId}
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
              value={newAssignment.quantity}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                boxSizing: 'border-box' 
              }}
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
                backgroundColor: '#10B981',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Create Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for filtering */}
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
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>Filter Assignments</h2>
        
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Personnel ID
            </label>
            <input
              type="number"
              name="personnelId"
              value={filterCriteria.personnelId}
              onChange={handleFilterInputChange}
              style={{
                width: '70%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            />
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
                width: '95%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
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
}

export default AssignmentPage;