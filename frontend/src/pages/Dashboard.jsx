import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCT_API = "http://localhost:8080/products";
const INVENTORY_API = "http://localhost:8080/inventory";
const ORDER_API = "http://localhost:8080/orders";

function Dashboard() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const [productsResponse, inventoryResponse, ordersResponse] =
        await Promise.all([
          fetch(PRODUCT_API),
          fetch(INVENTORY_API),
          fetch(ORDER_API)
        ]);

      if (
        !productsResponse.ok ||
        !inventoryResponse.ok ||
        !ordersResponse.ok
      ) {
        throw new Error("Failed to load dashboard data");
      }

      const productsData = await productsResponse.json();
      const inventoryData = await inventoryResponse.json();
      const ordersData = await ordersResponse.json();

      setProducts(
        Array.isArray(productsData) ? productsData : []
      );

      setInventory(
        Array.isArray(inventoryData) ? inventoryData : []
      );

      setOrders(
        Array.isArray(ordersData) ? ordersData : []
      );

    } catch (err) {

      console.error("Dashboard error:", err);

      setError(
        "Unable to load dashboard data. Check backend services."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  const totalProducts = products.length;


  const totalInventoryItems = inventory.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );


  const totalOrders = orders.length;


  const lowStock = inventory.filter(
    (item) =>
      Number(item.quantity || 0) <=
      Number(item.reorderLevel || 0)
  ).length;


  const totalSales = orders.reduce(
    (total, order) =>
      total +
      Number(
        order.totalAmount ??
        order.amount ??
        order.total ??
        order.price ??
        0
      ),
    0
  );


  const recentOrders = [...orders]
    .slice(-5)
    .reverse();


  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-mark">
            O
          </div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>Retail Management</span>
          </div>

        </div>


        <div className="sidebar-section-title">
          MAIN MENU
        </div>


        <nav className="sidebar-nav">

          <button
            className="active"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>


          <button
            onClick={() => navigate("/account")}
          >
            <span className="nav-icon">◉</span>
            <span>Account</span>
          </button>


          <button
            onClick={() => navigate("/products")}
          >
            <span className="nav-icon">▦</span>
            <span>Products</span>
          </button>


          <button
            onClick={() => navigate("/inventory")}
          >
            <span className="nav-icon">▤</span>
            <span>Inventory</span>
          </button>


          <button
            onClick={() => navigate("/orders")}
          >
            <span className="nav-icon">◫</span>
            <span>Orders</span>
          </button>


          <button
            onClick={() => navigate("/reports")}
          >
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

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back to OmniStock
            </p>
          </div>


          <div className="dashboard-actions">

            <button
              className="dashboard-refresh"
              onClick={loadDashboard}
            >
              ↻ Refresh
            </button>

            <div className="dashboard-profile">
              <div className="dashboard-avatar">
                H
              </div>

              <div>
                <strong>Hima</strong>
                <span>Administrator</span>
              </div>
            </div>

          </div>

        </header>


        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        {/* WELCOME */}

        <section className="dashboard-welcome">

          <div>

            <span className="welcome-label">
              OMNISTOCK OVERVIEW
            </span>

            <h2>
              Manage your retail operations
              <br />
              from one place.
            </h2>

            <p>
              Monitor products, inventory and orders
              across your connected services.
            </p>

          </div>


          <div className="welcome-icon">
            O
          </div>

        </section>


        {/* STAT CARDS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ▦
            </div>

            <div>
              <span>Total Products</span>

              <strong>
                {loading ? "..." : totalProducts}
              </strong>

              <small>
                Products in catalog
              </small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ▤
            </div>

            <div>
              <span>Inventory Items</span>

              <strong>
                {loading
                  ? "..."
                  : totalInventoryItems.toLocaleString("en-IN")}
              </strong>

              <small>
                Current stock quantity
              </small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ◫
            </div>

            <div>
              <span>Total Orders</span>

              <strong>
                {loading ? "..." : totalOrders}
              </strong>

              <small>
                Orders received
              </small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon warning">
              !
            </div>

            <div>
              <span>Low Stock</span>

              <strong>
                {loading ? "..." : lowStock}
              </strong>

              <small>
                Items need attention
              </small>
            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-content-grid">

          <div className="dashboard-panel">

            <div className="dashboard-panel-header">

              <div>
                <h3>Quick Actions</h3>
                <p>
                  Manage your retail system
                </p>
              </div>

            </div>


            <div className="quick-actions">

              <button
                onClick={() => navigate("/products")}
              >
                <span>＋</span>
                <div>
                  <strong>Add Product</strong>
                  <small>
                    Create a new product
                  </small>
                </div>
              </button>


              <button
                onClick={() => navigate("/inventory")}
              >
                <span>▤</span>
                <div>
                  <strong>Manage Inventory</strong>
                  <small>
                    Check current stock
                  </small>
                </div>
              </button>


              <button
                onClick={() => navigate("/orders")}
              >
                <span>◫</span>
                <div>
                  <strong>View Orders</strong>
                  <small>
                    Manage customer orders
                  </small>
                </div>
              </button>


              <button
                onClick={() => navigate("/reports")}
              >
                <span>◒</span>
                <div>
                  <strong>View Reports</strong>
                  <small>
                    Analyze business data
                  </small>
                </div>
              </button>

            </div>

          </div>


          {/* INVENTORY STATUS */}

          <div className="dashboard-panel">

            <div className="dashboard-panel-header">

              <div>
                <h3>Inventory Status</h3>
                <p>
                  Current stock overview
                </p>
              </div>

            </div>


            <div className="inventory-status-list">

              <div className="inventory-status-row">

                <span>In Stock</span>

                <strong>
                  {
                    inventory.filter(
                      item =>
                        Number(item.quantity || 0) >
                        Number(item.reorderLevel || 0)
                    ).length
                  }
                </strong>

              </div>


              <div className="inventory-status-row">

                <span>Low Stock</span>

                <strong>
                  {lowStock}
                </strong>

              </div>


              <div className="inventory-status-row">

                <span>Out of Stock</span>

                <strong>
                  {
                    inventory.filter(
                      item =>
                        Number(item.quantity || 0) === 0
                    ).length
                  }
                </strong>

              </div>


              <div className="inventory-status-total">

                <span>Total Stock Units</span>

                <strong>
                  {totalInventoryItems.toLocaleString("en-IN")}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* RECENT ORDERS */}

        <section className="dashboard-panel dashboard-orders-panel">

          <div className="dashboard-panel-header">

            <div>
              <h3>Recent Orders</h3>
              <p>
                Latest orders from Order Service
              </p>
            </div>

            <button
              onClick={() => navigate("/orders")}
              className="view-all-button"
            >
              View All →
            </button>

          </div>


          {loading ? (

            <div className="dashboard-empty">
              Loading orders...
            </div>

          ) : recentOrders.length === 0 ? (

            <div className="dashboard-empty">
              No orders available.
            </div>

          ) : (

            <div className="dashboard-orders-list">

              {recentOrders.map((order, index) => {

                const orderId =
                  order.id ??
                  order.orderId ??
                  index + 1;

                const customer =
                  order.customerName ??
                  order.customer ??
                  order.username ??
                  "Customer";

                const amount =
                  Number(
                    order.totalAmount ??
                    order.amount ??
                    order.total ??
                    order.price ??
                    0
                  );

                const status =
                  String(
                    order.status ??
                    order.orderStatus ??
                    "PLACED"
                  ).toUpperCase();


                return (

                  <div
                    className="dashboard-order-row"
                    key={orderId}
                  >

                    <div className="dashboard-order-id">
                      #{orderId}
                    </div>


                    <div className="dashboard-order-customer">

                      <div className="dashboard-order-avatar">
                        {customer
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span>
                        {customer}
                      </span>

                    </div>


                    <strong>
                      ₹{amount.toLocaleString("en-IN")}
                    </strong>


                    <span
                      className={`dashboard-order-status ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>

                );

              })}

            </div>

          )}

        </section>


        {/* SALES */}

        <section className="dashboard-sales-card">

          <div>
            <span>Total Sales</span>

            <strong>
              ₹{totalSales.toLocaleString("en-IN")}
            </strong>

            <small>
              Calculated from Order Service
            </small>
          </div>

          <button
            onClick={() => navigate("/orders")}
          >
            View Orders →
          </button>

        </section>


        <footer className="dashboard-footer">

          <span>
            © 2026 OmniStock Retail Management
          </span>

          <span>
            Connected to API Gateway
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;