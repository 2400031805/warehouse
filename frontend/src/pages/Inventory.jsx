import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/inventory";

function Inventory() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Inventory error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="inventory-page">

      {/* SIDEBAR */}
      <aside className="inventory-sidebar">

        <div className="inventory-logo">
          <div className="inventory-logo-mark">O</div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>Retail Management</span>
          </div>
        </div>

        <div className="inventory-menu-title">
          MAIN MENU
        </div>

        <nav className="inventory-nav">

          <button onClick={() => navigate("/dashboard")}>
            <span>⌂</span>
            Dashboard
          </button>

          <button onClick={() => navigate("/account")}>
            <span>◉</span>
            My Account
          </button>

          <button onClick={() => navigate("/products")}>
            <span>▦</span>
            Products
          </button>

          <button className="active">
            <span>▤</span>
            Inventory
          </button>

          <button onClick={() => navigate("/orders")}>
            <span>◫</span>
            Orders
          </button>

          <button onClick={() => navigate("/reports")}>
            <span>◒</span>
            Reports
          </button>

        </nav>

        <div className="inventory-sidebar-bottom">

          <div className="inventory-system-status">
            <span className="inventory-status-dot"></span>

            <div>
              <strong>System Online</strong>
              <small>All services connected</small>
            </div>
          </div>

          <button
            className="inventory-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="inventory-main">

        {/* HEADER */}
        <header className="inventory-header">

          <div>
            <h1>Inventory</h1>
            <p>Manage your stock levels</p>
          </div>

          <button
            className="inventory-refresh"
            onClick={fetchInventory}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </header>

        {/* SUMMARY */}
        <section className="inventory-summary">

          <div className="inventory-summary-card">
            <span className="inventory-card-label">
              TOTAL ITEMS
            </span>

            <strong>
              {items.length}
            </strong>

            <small>
              Inventory records
            </small>
          </div>

          <div className="inventory-summary-card">
            <span className="inventory-card-label">
              TOTAL STOCK
            </span>

            <strong>
              {items.reduce(
                (total, item) =>
                  total +
                  Number(
                    item.quantity ??
                    item.stock ??
                    item.availableQuantity ??
                    0
                  ),
                0
              )}
            </strong>

            <small>
              Units available
            </small>
          </div>

          <div className="inventory-summary-card">
            <span className="inventory-card-label">
              LOW STOCK
            </span>

            <strong>
              {
                items.filter((item) => {
                  const quantity = Number(
                    item.quantity ??
                    item.stock ??
                    item.availableQuantity ??
                    0
                  );

                  const reorderLevel = Number(
                    item.reorderLevel ?? 5
                  );

                  return quantity > 0 && quantity <= reorderLevel;
                }).length
              }
            </strong>

            <small>
              Need attention
            </small>
          </div>

          <div className="inventory-summary-card">
            <span className="inventory-card-label">
              OUT OF STOCK
            </span>

            <strong>
              {
                items.filter((item) => {
                  const quantity = Number(
                    item.quantity ??
                    item.stock ??
                    item.availableQuantity ??
                    0
                  );

                  return quantity === 0;
                }).length
              }
            </strong>

            <small>
              Unavailable items
            </small>
          </div>

        </section>

        {/* INVENTORY TABLE */}
        <section className="inventory-panel">

          <div className="inventory-panel-header">

            <div>
              <h2>Inventory Management</h2>

              <p>
                {items.length} inventory items found
              </p>
            </div>

          </div>

          {loading ? (

            <div className="inventory-message">
              Loading inventory...
            </div>

          ) : items.length === 0 ? (

            <div className="inventory-message">
              No inventory data found.
            </div>

          ) : (

            <div className="inventory-table-wrapper">

              <table className="inventory-table">

                <thead>
                  <tr>
                    <th>PRODUCT ID</th>
                    <th>QUANTITY</th>
                    <th>REORDER LEVEL</th>
                    <th>WAREHOUSE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {items.map((item) => {

                    const quantity = Number(
                      item.quantity ??
                      item.stock ??
                      item.availableQuantity ??
                      0
                    );

                    const reorderLevel = Number(
                      item.reorderLevel ?? 5
                    );

                    const status = getStatus(
                      quantity,
                      reorderLevel
                    );

                    return (
                      <tr key={item.id}>

                        <td>
                          <strong>
                            #{item.productId ?? item.id}
                          </strong>
                        </td>

                        <td>
                          <span className="inventory-quantity">
                            {quantity}
                          </span>
                        </td>

                        <td>
                          {reorderLevel}
                        </td>

                        <td>
                          <div className="inventory-warehouse">

                            <strong>
                              {item.warehouseName ||
                                "Warehouse"}
                            </strong>

                            <span>
                              {item.warehouseLocation ||
                                "—"}
                            </span>

                          </div>
                        </td>

                        <td>

                          <span
                            className={`inventory-status ${status
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="inventory-view-button"
                            onClick={() =>
                              alert(
                                `Product ID: ${
                                  item.productId ?? item.id
                                }\nQuantity: ${quantity}\nReorder Level: ${reorderLevel}\nWarehouse: ${
                                  item.warehouseName ||
                                  "Warehouse"
                                }`
                              )
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="inventory-footer">

          <span>OmniStock</span>

          <span>
            Retail Management Platform
          </span>

          <span>
            • System Online
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Inventory;