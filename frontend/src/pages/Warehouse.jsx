import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/warehouses";

function Warehouse() {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch warehouses");
      }

      const data = await response.json();

      console.log("WAREHOUSES:", data);

      setWarehouses(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("WAREHOUSE ERROR:", error);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const activeCount = warehouses.filter(
    (warehouse) =>
      warehouse.status &&
      warehouse.status.toLowerCase() === "active"
  ).length;

  const inactiveCount = warehouses.length - activeCount;

  return (
    <div className="warehouse-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-mark">O</div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>Retail Management</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          <button onClick={() => navigate("/dashboard")}>
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button onClick={() => navigate("/account")}>
            <span className="nav-icon">◉</span>
            <span>Account</span>
          </button>

          <button onClick={() => navigate("/products")}>
            <span className="nav-icon">▦</span>
            <span>Products</span>
          </button>

          <button onClick={() => navigate("/inventory")}>
            <span className="nav-icon">▤</span>
            <span>Inventory</span>
          </button>

          <button onClick={() => navigate("/orders")}>
            <span className="nav-icon">◫</span>
            <span>Orders</span>
          </button>

          <button className="active">
            <span className="nav-icon">▥</span>
            <span>Warehouse</span>
          </button>

          <button onClick={() => navigate("/reports")}>
            <span className="nav-icon">◒</span>
            <span>Reports</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>All services connected</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={() => navigate("/")}
          >
            <span className="nav-icon">↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN */}
      <main className="warehouse-main">

        <div className="warehouse-header">

          <div>
            <span className="warehouse-label">
              OMNISTOCK
            </span>

            <h1>Warehouse Management</h1>

            <p>
              Manage warehouse locations, managers and status.
            </p>
          </div>

          <button
            className="warehouse-refresh"
            onClick={fetchWarehouses}
          >
            ↻ Refresh
          </button>

        </div>


        {/* SUMMARY */}
        <div className="warehouse-summary">

          <div className="warehouse-card">
            <span>Total Warehouses</span>
            <strong>{warehouses.length}</strong>
          </div>

          <div className="warehouse-card">
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>

          <div className="warehouse-card">
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>

        </div>


        {/* WAREHOUSE LIST */}
        <section className="warehouse-panel">

          <div className="warehouse-panel-header">

            <div>
              <h2>Warehouse List</h2>
              <p>All registered warehouses</p>
            </div>

          </div>


          {loading ? (

            <div className="warehouse-loading">
              Loading warehouses...
            </div>

          ) : warehouses.length === 0 ? (

            <div className="warehouse-empty">
              No warehouses found.
            </div>

          ) : (

            <div className="warehouse-table-wrapper">

              <table className="warehouse-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Warehouse</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {warehouses.map((warehouse) => (

                    <tr key={warehouse.id}>

                      <td>
                        #{warehouse.id}
                      </td>

                      <td>
                        <div className="warehouse-name">

                          <div className="warehouse-avatar">
                            {warehouse.warehouseName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <strong>
                            {warehouse.warehouseName}
                          </strong>

                        </div>
                      </td>

                      <td>
                        {warehouse.location}
                      </td>

                      <td>
                        {warehouse.manager}
                      </td>

                      <td>
                        {warehouse.contact}
                      </td>

                      <td>

                        <span
                          className={
                            warehouse.status?.toLowerCase() === "active"
                              ? "warehouse-status active"
                              : "warehouse-status inactive"
                          }
                        >
                          {warehouse.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        <footer className="warehouse-footer">
          © 2026 OmniStock Retail Management
        </footer>

      </main>

    </div>
  );
}

export default Warehouse;