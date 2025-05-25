import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../Components/HeaderComponent';
import Sidebar from '../Components/SidebarComponent';
import Cookies from 'js-cookie';
import CustomDateInput from '../Components/CustomeDateInput';
import { FadeLoader } from 'react-spinners';
import { Navigate, useNavigate } from 'react-router-dom';

export const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  maxWidth: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '32px',
  },
  section: {
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #d1d5db',
    padding: '12px 16px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#374151',
  },
  thBlue: {
    backgroundColor: '#eff6ff',
  },
  thGreen: {
    backgroundColor: '#f0fdf4',
  },
  thRed: {
    backgroundColor: '#fef2f2',
  },
  thGray: {
    backgroundColor: '#f9fafb',
  },
  thTale: {
    backgroundColor: '#ccfbf1',
  },
  thOrange: {
    backgroundColor: '#ffedd5',
  },
  td: {
    border: '1px solid #d1d5db',
    padding: '12px 16px',
    textAlign: 'center',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
  trHover: {
    backgroundColor: '#f9fafb',
  },
  fontMedium: {
    fontWeight: '500',
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '14px',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgePurple: {
    backgroundColor: '#e9d5ff',
    color: '#7c2d92',
  },
  badgeGray: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
  },
  badgeRed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  textGreen: {
    color: '#16a34a',
    fontWeight: '600',
  },
  textBlue: {
    color: '#2563eb',
    fontWeight: '600',
  },
  textRed: {
    color: '#dc2626',
    fontWeight: '600',
  },
  textGray: {
    color: '#6b7280',
  },
  textCenter: {
    textAlign: 'center',
  },
  emptyRow: {
    padding: '32px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  section: {
    padding: '24px 30px',
    borderRadius: '10px',
    margin: '30px auto',
    fontFamily: "'Roboto', sans-serif",
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '24px',
    borderBottom: '2px solid #eee',
    paddingBottom: '8px',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  select: {
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    cursor: 'pointer',
  },
  selectFocus: {
    borderColor: '#5b9ef8',
  },
  datePickerWrapper: {
    width: '100%',
  },
  datePicker: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151',
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '12px',
  },
  pieChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pieChartLegend: {
    paddingLeft: '24px',
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    marginRight: '12px',
  },
  legendText: {
    color: '#374151',
  },
  sortableHeader: {
    border: '1px solid #d1d5db',
    padding: '12px 16px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
    transition: 'background-color 0.2s',
  },
  sortableHeaderHover: {
    backgroundColor: '#e5e7eb',
  },
};

const InventoryDashboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    baseId: '',
    equipmentType: '',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-22'),
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get('jwtToken');
        console.log('JWT Token for initial fetch:', token || 'No token found');
        if (!token) navigate("/loginPage");

        // Fetch bases
        const basesResponse = await fetch('http://localhost:8080/base/getListOfBase', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (!basesResponse.ok) navigate("/loginPage");
        const basesData = await basesResponse.json();
        console.log('Bases:', basesData);
        setBases(basesData);

        // Fetch assets
        const assetsResponse = await fetch('http://localhost:8080/asset/getListOfAsset', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (!assetsResponse.ok) throw new Error(`Failed to fetch assets: ${assetsResponse.statusText}`);
        const assetsData = await assetsResponse.json();
        console.log('Assets:', assetsData);
        setAssets(assetsData);

        // Set default filters
        const updatedFilters = {
          ...filters,
          baseId: basesData.length > 0 ? basesData[0].id : '',
          equipmentType: assetsData.length > 0 ? assetsData[0].type : '',
        };
        console.log('Setting default filters:', updatedFilters);
        setFilters(updatedFilters);

        // Fetch dashboard data if filters are valid
        if (updatedFilters.baseId && updatedFilters.equipmentType) {
          console.log('Fetching dashboard with filters:', updatedFilters);
          const params = new URLSearchParams({
            baseId: updatedFilters.baseId,
            equipmentType: updatedFilters.equipmentType,
            startDate: updatedFilters.startDate.toISOString().split('T')[0],
            endDate: updatedFilters.endDate.toISOString().split('T')[0],
          });
          console.log('Fetching dashboard with params:', params.toString());

          const response = await fetch(`http://localhost:8080/dashboard/getDashboard?${params}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });

          console.log('Response status:', response.status);
          if (!response.ok) throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
          const data = await response.json();
          console.log('Dashboard data:', data);

          // Handle both object and array responses
          const dashboardDataToSet = Array.isArray(data) && data.length > 0 ? data[0] : data;
          if (!dashboardDataToSet || Object.keys(dashboardDataToSet).length === 0) {
            setError('No dashboard data available for the selected filters');
            setDashboardData(null);
          } else {
            // Map assetId to handle various field names
            const mappedData = {
              ...dashboardDataToSet,
              purchaseDetails: dashboardDataToSet.purchaseDetails?.map(item => ({
                ...item,
                assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
              })) || [],
              transferInDetails: dashboardDataToSet.transferInDetails?.map(item => ({
                ...item,
                assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
              })) || [],
              transferOutDetails: dashboardDataToSet.transferOutDetails?.map(item => ({
                ...item,
                assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
              })) || [],
            };
            console.log('Mapped dashboardData:', mappedData); // Debug mapped data
            setDashboardData(mappedData);
          }
        } else {
          setError('No valid base or equipment type available');
        }

        setLoading(false);
      } catch (err) {
        console.error('Initial fetch error:', err.message, err.stack);
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch dashboard data when filters change
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!filters.baseId || !filters.equipmentType) {
        console.log('Filters incomplete:', filters);
        setError('Please select a base and equipment type');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get('jwtToken');
        console.log('JWT Token for dashboard:', token || 'No token found');
        if (!token) throw new Error('Authentication token not found');

        const params = new URLSearchParams({
          baseId: filters.baseId,
          equipmentType: filters.equipmentType,
          startDate: filters.startDate.toISOString().split('T')[0],
          endDate: filters.endDate.toISOString().split('T')[0],
        });
        console.log('Fetching dashboard with params:', params.toString());

        const response = await fetch(`http://localhost:8080/dashboard/getDashboard?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        if (!response.ok) throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Dashboard data:', data);

        // Handle both object and array responses
        const dashboardDataToSet = Array.isArray(data) && data.length > 0 ? data[0] : data;
        if (!dashboardDataToSet || Object.keys(dashboardDataToSet).length === 0) {
          setError('No dashboard data available for the selected filters');
          setDashboardData(null);
        } else {
          // Map assetId to handle various field names
          const mappedData = {
            ...dashboardDataToSet,
            purchaseDetails: dashboardDataToSet.purchaseDetails?.map(item => ({
              ...item,
              assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
            })) || [],
            transferInDetails: dashboardDataToSet.transferInDetails?.map(item => ({
              ...item,
              assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
            })) || [],
            transferOutDetails: dashboardDataToSet.transferOutDetails?.map(item => ({
              ...item,
              assetId: item.assetId || item.assertId || item.asset_id || item.id || 'N/A', // Handle multiple field names
            })) || [],
          };
          console.log('Mapped dashboardData:', mappedData); // Debug mapped data
          setDashboardData(mappedData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message, err.stack);
        setError(`Failed to load dashboard data: ${err.message}`);
        setLoading(false);
      }
    };

    if (bases.length > 0 && assets.length > 0 && filters.baseId && filters.equipmentType) {
      fetchDashboardData();
    }
  }, [filters.baseId, filters.equipmentType, filters.startDate, filters.endDate]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data, key, direction) => {
    if (!key || !data) return data;
    return [...data].sort((a, b) => {
      const aValue = a[key] ?? ''; // Handle undefined/null
      const bValue = b[key] ?? '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const SortableHeader = ({ children, sortKey, currentSort, onSort }) => (
    <th
      style={{ ...styles.th, ...styles.sortableHeader }}
      onClick={() => onSort(sortKey)}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.sortableHeaderHover.backgroundColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.sortableHeader.backgroundColor)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
        <span style={{ marginLeft: '8px' }}>
          {currentSort.key === sortKey ? (currentSort.direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  );

  // Rendering logic
  if (error) {
    return (
      <div style={{ ...styles.textCenter, ...styles.textRed, padding: '32px' }}>
        Error: {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <FadeLoader color="black" height={15} width={5} radius={2} margin={2} />
      </div>
    );
  }
  if (!dashboardData) {
    return (
      <div style={{ ...styles.textCenter, padding: '32px' }}>
        No data available
      </div>
    );
  }

  // Prepare chart data
  const purchaseChartData = dashboardData.purchaseDetails?.map((item) => ({
    date: item.purchaseDate,
    quantity: item.quantity,
    id: item.id,
  })) || [];

  const transferOutChartData = dashboardData.transferOutDetails?.map((item) => ({
    date: item.transferDate,
    quantity: -item.quantity,
    id: item.id,
  })) || [];

  const transactionSummaryData = [
    {
      type: 'Purchases',
      count: dashboardData.purchaseDetails?.length || 0,
      totalQuantity: dashboardData.purchaseDetails?.reduce((sum, p) => sum + p.quantity, 0) || 0,
      color: '#10B981',
    },
    {
      type: 'Transfers In',
      count: dashboardData.transferInDetails?.length || 0,
      totalQuantity: dashboardData.transferInDetails?.reduce((sum, t) => sum + t.quantity, 0) || 0,
      color: '#3B82F6',
    },
    {
      type: 'Transfers Out',
      count: dashboardData.transferOutDetails?.length || 0,
      totalQuantity: dashboardData.transferOutDetails?.reduce((sum, t) => sum + t.quantity, 0) || 0,
      color: '#EF4444',
    },
  ].filter((item) => item.totalQuantity > 0);

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 24, backgroundColor: '#f9fafb', overflowY: 'auto', marginTop: '40px' }}>
          <div style={styles.maxWidth}>
            <h1 style={styles.title}>Asset Management Dashboard</h1>

            {/* Filter Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Filters</h2>
              <div style={styles.filterGrid}>
                <div style={styles.filterItem}>
                  <label style={styles.label}>Base</label>
                  <select
                    value={filters.baseId}
                    onChange={(e) => handleFilterChange('baseId', e.target.value)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1.5px solid #888',
                      outline: 'none',
                      backgroundColor: '#f9f9f9',
                      transition: 'border-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#5b9bd5')}
                    onBlur={(e) => (e.target.style.borderColor = '#888')}
                  >
                    {bases.length === 0 ? (
                      <option value="">No bases available</option>
                    ) : (
                      bases.map((base) => (
                        <option key={base.id} value={base.id}>
                          {base.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.filterItem}>
                  <label style={styles.label}>Equipment Type</label>
                  <select
                    value={filters.equipmentType}
                    onChange={(e) => handleFilterChange('equipmentType', e.target.value)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1.5px solid #888',
                      outline: 'none',
                      backgroundColor: '#f9f9f9',
                      transition: 'border-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#5b9bd5')}
                    onBlur={(e) => (e.target.style.borderColor = '#888')}
                  >
                    {assets.length === 0 ? (
                      <option value="">No assets available</option>
                    ) : (
                      assets.map((asset) => (
                        <option key={asset.id} value={asset.type}>
                          {asset.name} ({asset.type})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={styles.filterItem}>
                  <label style={styles.label}>Start Date</label>
                  <div style={styles.datePickerWrapper}>
                    <DatePicker
                      selected={filters.startDate}
                      onChange={(date) => handleFilterChange('startDate', date)}
                      selectsStart
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      customInput={<CustomDateInput />}
                    />
                  </div>
                </div>

                <div style={styles.filterItem}>
                  <label style={styles.label}>End Date</label>
                  <div style={styles.datePickerWrapper}>
                    <DatePicker
                      selected={filters.endDate}
                      onChange={(date) => handleFilterChange('endDate', date)}
                      selectsEnd
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      minDate={filters.startDate}
                      customInput={<CustomDateInput />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Summary */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Inventory Summary</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thBlue}>
                      <th style={styles.th}>Metric</th>
                      <th style={styles.th}>Value</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Opening Balance</td>
                      <td style={styles.td}>{dashboardData.openingBalance}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeBlue }}>Initial</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Net Movement</td>
                      <td style={styles.td}>
                        <span style={styles.textGreen}>+{dashboardData.netMovement}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeGreen }}>Positive</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Closing Balance</td>
                      <td style={{ ...styles.td, ...styles.fontBold }}>{dashboardData.closingBalance}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgePurple }}>Current</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Assigned</td>
                      <td style={styles.td}>{dashboardData.assigned}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeGray }}>None</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Expended</td>
                      <td style={styles.td}>{dashboardData.expended}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeGray }}>None</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchase Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Purchase Details</h2>
              {purchaseChartData.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={styles.chartTitle}>Purchase Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={purchaseChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, 'Quantity']} />
                      <Legend />
                      <Bar dataKey="quantity" fill="#10B981" name="Purchase Quantity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.th}>
                      <SortableHeader sortKey="id" currentSort={sortConfig} onSort={handleSort}>
                        Purchase ID
                      </SortableHeader>
                      <SortableHeader sortKey="baseId" currentSort={sortConfig} onSort={handleSort}>
                        Base ID
                      </SortableHeader>
                      <SortableHeader sortKey="assetId" currentSort={sortConfig} onSort={handleSort}>
                        Asset ID
                      </SortableHeader>
                      <SortableHeader sortKey="quantity" currentSort={sortConfig} onSort={handleSort}>
                        Quantity
                      </SortableHeader>
                      <SortableHeader sortKey="purchaseDate" currentSort={sortConfig} onSort={handleSort}>
                        Purchase Date
                      </SortableHeader>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(dashboardData.purchaseDetails || [], sortConfig.key, sortConfig.direction).map((purchase) => (
                      <tr
                        key={purchase.id}
                        style={styles.tr}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                      >
                        <td style={{ ...styles.td, ...styles.fontMedium }}>{purchase.id}</td>
                        <td style={styles.td}>{purchase.baseId}</td>
                        <td style={styles.td}>{purchase.assetId}</td> {/* Removed yellow background */}
                        <td style={styles.td}>
                          <span style={styles.textGreen}>+{purchase.quantity}</span>
                        </td>
                        <td style={styles.td}>{purchase.purchaseDate}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, ...styles.badgeGreen }}>Purchase</span>
                        </td>
                      </tr>
                    ))}
                    {(!dashboardData.purchaseDetails || dashboardData.purchaseDetails.length === 0) && (
                      <tr>
                        <td colSpan="6" style={{ ...styles.td, ...styles.emptyRow }}>
                          No purchase records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transfer In Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Transfer In Details</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.th}>
                      <SortableHeader sortKey="id" currentSort={sortConfig} onSort={handleSort}>
                        Transfer ID
                      </SortableHeader>
                      <SortableHeader sortKey="fromBaseId" currentSort={sortConfig} onSort={handleSort}>
                        From Base
                      </SortableHeader>
                      <SortableHeader sortKey="toBaseId" currentSort={sortConfig} onSort={handleSort}>
                        To Base
                      </SortableHeader>
                      <SortableHeader sortKey="assetId" currentSort={sortConfig} onSort={handleSort}>
                        Asset ID
                      </SortableHeader>
                      <SortableHeader sortKey="quantity" currentSort={sortConfig} onSort={handleSort}>
                        Quantity
                      </SortableHeader>
                      <SortableHeader sortKey="transferDate" currentSort={sortConfig} onSort={handleSort}>
                        Transfer Date
                      </SortableHeader>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!dashboardData.transferInDetails || dashboardData.transferInDetails.length === 0) ? (
                      <tr>
                        <td colSpan="7" style={{ ...styles.td, ...styles.emptyRow }}>
                          No transfer in records found
                        </td>
                      </tr>
                    ) : (
                      sortData(dashboardData.transferInDetails, sortConfig.key, sortConfig.direction).map((transfer) => (
                        <tr
                          key={transfer.id}
                          style={styles.tr}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                        >
                          <td style={{ ...styles.td, ...styles.fontMedium }}>{transfer.id}</td>
                          <td style={styles.td}>{transfer.fromBaseId}</td>
                          <td style={styles.td}>{transfer.toBaseId}</td>
                          <td style={styles.td}>{transfer.assetId}</td> {/* Removed yellow background */}
                          <td style={styles.td}>
                            <span style={styles.textBlue}>+{transfer.quantity}</span>
                          </td>
                          <td style={styles.td}>{transfer.transferDate}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, ...styles.badgeBlue }}>Transfer In</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transfer Out Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Transfer Out Details</h2>
              {transferOutChartData.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={styles.chartTitle}>Transfer Out Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={transferOutChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [Math.abs(value), 'Quantity Out']} />
                      <Legend />
                      <Bar dataKey="quantity" fill="#EF4444" name="Transfer Out Quantity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRed}>
                      <SortableHeader sortKey="id" currentSort={sortConfig} onSort={handleSort}>
                        Transfer ID
                      </SortableHeader>
                      <SortableHeader sortKey="fromBaseId" currentSort={sortConfig} onSort={handleSort}>
                        From Base
                      </SortableHeader>
                      <SortableHeader sortKey="toBaseId" currentSort={sortConfig} onSort={handleSort}>
                        To Base
                      </SortableHeader>
                      <SortableHeader sortKey="assetId" currentSort={sortConfig} onSort={handleSort}>
                        Asset ID
                      </SortableHeader>
                      <SortableHeader sortKey="quantity" currentSort={sortConfig} onSort={handleSort}>
                        Quantity
                      </SortableHeader>
                      <SortableHeader sortKey="transferDate" currentSort={sortConfig} onSort={handleSort}>
                        Transfer Date
                      </SortableHeader>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(dashboardData.transferOutDetails || [], sortConfig.key, sortConfig.direction).map((transfer) => (
                      <tr
                        key={transfer.id}
                        style={styles.tr}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                      >
                        <td style={{ ...styles.td, ...styles.fontMedium }}>{transfer.id}</td>
                        <td style={styles.td}>{transfer.fromBaseId}</td>
                        <td style={styles.td}>{transfer.toBaseId}</td>
                        <td style={styles.td}>{transfer.assetId}</td> {/* Removed yellow background */}
                        <td style={styles.td}>
                          <span style={styles.textRed}>-{transfer.quantity}</span>
                        </td>
                        <td style={styles.td}>{transfer.transferDate}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, ...styles.badgeRed }}>Transfer Out</span>
                        </td>
                      </tr>
                    ))}
                    {(!dashboardData.transferOutDetails || dashboardData.transferOutDetails.length === 0) && (
                      <tr>
                        <td colSpan="7" style={{ ...styles.td, ...styles.emptyRow }}>
                          No transfer out records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction Summary */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Transaction Summary</h2>
              {transactionSummaryData.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={styles.chartTitle}>Transaction Distribution</h3>
                  <div style={styles.pieChartContainer}>
                    <div style={{ width: '100%' }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={transactionSummaryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ type, totalQuantity }) => `${type}: ${totalQuantity}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="totalQuantity"
                          >
                            {transactionSummaryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [value, 'Total Quantity']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={styles.pieChartLegend}>
                      <h4 style={styles.legendTitle}>Legend</h4>
                      {transactionSummaryData.map((item, index) => (
                        <div key={item.type} style={styles.legendItem}>
                          <div
                            style={{ ...styles.legendColor, backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span style={styles.legendText}>
                            {item.type}: {item.totalQuantity} units ({item.count} transactions)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thGray}>
                      <th style={styles.th}>Transaction Type</th>
                      <th style={styles.th}>Count</th>
                      <th style={styles.th}>Total Quantity</th>
                      <th style={styles.th}>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Purchases</td>
                      <td style={styles.td}>{dashboardData.purchaseDetails?.length || 0}</td>
                      <td style={styles.td}>
                        {dashboardData.purchaseDetails?.reduce((sum, p) => sum + p.quantity, 0) || 0}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeGreen }}>Positive</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Transfers In</td>
                      <td style={styles.td}>{dashboardData.transferInDetails?.length || 0}</td>
                      <td style={styles.td}>
                        {dashboardData.transferInDetails?.reduce((sum, t) => sum + t.quantity, 0) || 0}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeBlue }}>Positive</span>
                      </td>
                    </tr>
                    <tr
                      style={styles.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <td style={{ ...styles.td, ...styles.fontMedium }}>Transfers Out</td>
                      <td style={styles.td}>{dashboardData.transferOutDetails?.length || 0}</td>
                      <td style={styles.td}>
                        {dashboardData.transferOutDetails?.reduce((sum, t) => sum + t.quantity, 0) || 0}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...styles.badgeRed }}>Negative</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;