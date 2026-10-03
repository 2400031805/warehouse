import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ORDER_API = "http://localhost:8080/orders";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(ORDER_API);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderId = (order) =>
    order.id ?? order.orderId ?? "-";

  const getCustomer = (order) =>
    order.customerName ??
    order.customer ??
    order.username ??
    "Customer";

  const getAmount = (order) =>
    Number(
      order.totalAmount ??
      order.amount ??
      order.total ??
      order.price ??
      0
    );

  const getStatus = (order) =>
    String(
      order.status ??
      order.orderStatus ??
      "PLACED"
    ).toUpperCase();

  const getDate = (order) =>
    order.orderDate ??
    order.createdAt ??
    order.createdDate ??
    "-";

  const placedOrders = orders.filter(
    (order) => getStatus(order) === "PLACED"
  ).length;

  const completedOrders = orders.filter(
    (order) => getStatus(order) === "COMPLETED"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      getStatus(order) === "PENDING" ||
      getStatus(order) === "PROCESSING"
  ).length;

  const totalSales = orders.reduce(
    (sum, order) => sum + getAmount(order),
    0
  );

  return (
    <div className="orders-page">

      {/* SIDEBAR */}
      <aside className="orders-sidebar">

        <div className="orders-logo">
          <div className="orders-logo-mark">O</div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>Retail Management</span>
          </div>
        </div>

        <div className="orders-menu-title">
          MAIN MENU
        </div>

        <nav className="orders-nav">

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

          <button className="active">
            <span>◫</span>
            Orders
          </button>

          <button onClick={() => navigate("/reports")}>
            <span>◒</span>
            Reports
          </button>

        </nav>

        <div className="orders-sidebar-bottom">

          <div className="orders-system">
            <span></span>

            <div>
              <strong>System Online</strong>
              <small>All services connected</small>
            </div>
          </div>

          <button
            className="orders-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="orders-main">

        <header className="orders-topbar">

          <div>
            <h1>Orders</h1>
            <p>Manage and monitor customer orders</p>
          </div>

          <button
            className="orders-refresh"
            onClick={fetchOrders}
          >
            ↻ Refresh
          </button>

        </header>

        {/* CARDS */}
        <section className="orders-cards">

          <div className="orders-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
            <small>All customer orders</small>
          </div>

          <div className="orders-card">
            <span>Placed</span>
            <strong>{placedOrders}</strong>
            <small>Newly placed orders</small>
          </div>

          <div className="orders-card">
            <span>Completed</span>
            <strong>{completedOrders}</strong>
            <small>Completed orders</small>
          </div>

          <div className="orders-card">
            <span>Total Sales</span>
            <strong>
              ₹{totalSales.toLocaleString("en-IN")}
            </strong>
            <small>Total order value</small>
          </div>

        </section>

        {/* TABLE */}
        <section className="orders-box">

          <div className="orders-box-header">

            <div>
              <h2>Recent Orders</h2>
              <p>Orders received from Order Service</p>
            </div>

            <span>
              {orders.length} Orders
            </span>

          </div>

          {loading && (
            <div className="orders-empty">
              Loading orders...
            </div>
          )}

          {!loading && error && (
            <div className="orders-empty error">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="orders-empty">
              No orders found.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (

            <div className="orders-table-container">

              <table className="orders-clean-table">

                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order, index) => {

                    const status = getStatus(order);

                    return (
                      <tr key={getOrderId(order) || index}>

                        <td>
                          <strong>
                            #{getOrderId(order)}
                          </strong>
                        </td>

                        <td>
                          <div className="orders-customer">

                            <div className="orders-avatar">
                              {getCustomer(order)
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {getCustomer(order)}
                            </span>

                          </div>
                        </td>

                        <td>
                          <strong>
                            ₹{getAmount(order).toLocaleString("en-IN")}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`orders-status ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          {getDate(order)}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        <footer className="orders-footer">
          <span>© 2026 OmniStock Retail Management</span>
          <span>Order Service connected through API Gateway</span>
        </footer>

      </main>

    </div>
  );
}

export default Orders;