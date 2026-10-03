import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCT_API = "http://localhost:8080/products";
const INVENTORY_API = "http://localhost:8080/inventory";
const ORDER_API = "http://localhost:8080/orders";

function Reports() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [productRes, inventoryRes, orderRes] =
        await Promise.all([
          fetch(PRODUCT_API),
          fetch(INVENTORY_API),
          fetch(ORDER_API)
        ]);

      if (
        !productRes.ok ||
        !inventoryRes.ok ||
        !orderRes.ok
      ) {
        throw new Error("Failed to load reports");
      }

      const productData = await productRes.json();
      const inventoryData = await inventoryRes.json();
      const orderData = await orderRes.json();

      setProducts(Array.isArray(productData) ? productData : []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);

    } catch (err) {
      console.error(err);
      setError("Unable to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const totalStock = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const lowStock = inventory.filter(
    item =>
      Number(item.quantity || 0) <=
      Number(item.reorderLevel || 0)
  ).length;

  const outOfStock = inventory.filter(
    item => Number(item.quantity || 0) === 0
  ).length;

  const totalSales = orders.reduce(
    (sum, order) =>
      sum +
      Number(
        order.totalAmount ??
        order.amount ??
        order.total ??
        order.price ??
        0
      ),
    0
  );

  const averageOrderValue =
    orders.length > 0
      ? totalSales / orders.length
      : 0;

  const getStatus = (item) => {
    const quantity = Number(item.quantity || 0);
    const reorderLevel = Number(item.reorderLevel || 0);

    if (quantity === 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="reports-page">

      {/* SIDEBAR */}

      <aside className="reports-sidebar">

        <div className="reports-logo">

          <div className="reports-logo-mark">
            O
          </div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>Retail Management</span>
          </div>

        </div>

        <div className="reports-menu-title">
          MAIN MENU
        </div>

        <nav className="reports-nav">

          <button onClick={() => navigate("/dashboard")}>
            <span>⌂</span>
            Dashboard
          </button>

          <button onClick={() => navigate("/account")}>
            <span>◉</span>
            Account
          </button>

          <button onClick={() => navigate("/products")}>
            <span>▦</span>
            Products
          </button>

          <button onClick={() => navigate("/inventory")}>
            <span>▤</span>
            Inventory
          </button>

          <button onClick={() => navigate("/orders")}>
            <span>◫</span>
            Orders
          </button>

          <button className="active">
            <span>◒</span>
            Reports
          </button>

        </nav>

        <div className="reports-sidebar-bottom">

          <div className="reports-system">
            <span></span>

            <div>
              <strong>System Online</strong>
              <small>All services connected</small>
            </div>
          </div>

          <button
            className="reports-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="reports-main">

        <header className="reports-topbar">

          <div>
            <h1>Reports</h1>
            <p>
              Business overview from connected microservices
            </p>
          </div>

          <button
            className="reports-refresh"
            onClick={loadReports}
          >
            ↻ Refresh
          </button>

        </header>


        {error && (
          <div className="reports-error">
            {error}
          </div>
        )}


        {/* SUMMARY */}

        <section className="reports-summary">

          <div className="report-card">

            <div className="report-card-icon">
              ▦
            </div>

            <span>Total Products</span>

            <strong>
              {loading ? "..." : products.length}
            </strong>

            <small>
              Products in catalog
            </small>

          </div>


          <div className="report-card">

            <div className="report-card-icon">
              ▤
            </div>

            <span>Total Stock</span>

            <strong>
              {loading
                ? "..."
                : totalStock.toLocaleString("en-IN")}
            </strong>

            <small>
              Units available
            </small>

          </div>


          <div className="report-card">

            <div className="report-card-icon">
              ◫
            </div>

            <span>Total Orders</span>

            <strong>
              {loading ? "..." : orders.length}
            </strong>

            <small>
              Customer orders
            </small>

          </div>


          <div className="report-card">

            <div className="report-card-icon">
              ₹
            </div>

            <span>Total Sales</span>

            <strong>
              ₹{totalSales.toLocaleString("en-IN")}
            </strong>

            <small>
              Total order value
            </small>

          </div>

        </section>


        {/* INVENTORY REPORT */}

        <section className="reports-grid">

          <div className="reports-panel">

            <div className="reports-panel-header">

              <div>
                <h2>Inventory Report</h2>
                <p>
                  Current stock condition
                </p>
              </div>

            </div>


            <div className="inventory-report-stats">

              <div>
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


              <div>
                <span>Low Stock</span>

                <strong className="low-value">
                  {lowStock}
                </strong>
              </div>


              <div>
                <span>Out of Stock</span>

                <strong className="out-value">
                  {outOfStock}
                </strong>
              </div>

            </div>


            <div className="report-table-wrapper">

              <table className="report-table">

                <thead>
                  <tr>
                    <th>PRODUCT ID</th>
                    <th>QUANTITY</th>
                    <th>REORDER LEVEL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  {inventory.map((item, index) => {

                    const status = getStatus(item);

                    return (
                      <tr key={item.id || index}>

                        <td>
                          #{item.productId}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          {item.reorderLevel}
                        </td>

                        <td>
                          <span
                            className={`report-status ${status
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {status}
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>


          {/* SALES SUMMARY */}

          <div className="reports-panel">

            <div className="reports-panel-header">

              <div>
                <h2>Sales Summary</h2>
                <p>
                  Order service performance
                </p>
              </div>

            </div>


            <div className="sales-summary">

              <div className="sales-main">

                <span>Total Sales</span>

                <strong>
                  ₹{totalSales.toLocaleString("en-IN")}
                </strong>

              </div>


              <div className="sales-row">

                <span>Total Orders</span>

                <strong>
                  {orders.length}
                </strong>

              </div>


              <div className="sales-row">

                <span>Average Order Value</span>

                <strong>
                  ₹{Math.round(
                    averageOrderValue
                  ).toLocaleString("en-IN")}
                </strong>

              </div>


              <div className="sales-row">

                <span>Order Service</span>

                <strong className="connected">
                  Connected
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* PRODUCT REPORT */}

        <section className="reports-panel product-report">

          <div className="reports-panel-header">

            <div>
              <h2>Product Catalog</h2>
              <p>
                Products currently available in Product Service
              </p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="report-view-button"
            >
              Manage Products →
            </button>

          </div>


          <div className="report-product-grid">

            {products.map((product, index) => (

              <div
                className="report-product-card"
                key={product.id || index}
              >

                <div className="report-product-avatar">
                  {(product.name || "P")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <strong>
                    {product.name || "Unnamed Product"}
                  </strong>

                  <span>
                    {product.category || "No category"}
                  </span>

                </div>

                <strong className="report-product-price">
                  ₹{Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            ))}

          </div>

        </section>


        <footer className="reports-footer">

          <span>
            © 2026 OmniStock Retail Management
          </span>

          <span>
            Reports generated from API Gateway
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Reports;