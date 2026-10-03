import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCT_API = "http://localhost:8080/products";
const INVENTORY_API = "http://localhost:8080/inventory";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: ""
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PRODUCTS AND INVENTORY
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productResponse, inventoryResponse] =
        await Promise.all([
          fetch(PRODUCT_API),
          fetch(INVENTORY_API)
        ]);

      if (!productResponse.ok) {
        throw new Error("Failed to fetch products");
      }

      if (!inventoryResponse.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const productData = await productResponse.json();
      const inventoryData = await inventoryResponse.json();

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );

      setInventory(
        Array.isArray(inventoryData)
          ? inventoryData
          : []
      );

    } catch (error) {
      console.error(
        "Error loading products/inventory:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // FIND INVENTORY
  // ==========================================

  const getInventory = (productId) => {
    return inventory.find(
      (item) =>
        Number(item.productId) === Number(productId)
    );
  };

  // ==========================================
  // GET QUANTITY
  // ==========================================

  const getQuantity = (productId) => {
    const item = getInventory(productId);

    if (!item) {
      return 0;
    }

    return Number(item.quantity) || 0;
  };

  // ==========================================
  // GET STOCK STATUS
  // ==========================================

  const getStatus = (productId) => {
    const item = getInventory(productId);

    if (!item) {
      return "Out of Stock";
    }

    const quantity = Number(item.quantity) || 0;
    const reorderLevel =
      Number(item.reorderLevel) || 0;

    if (quantity === 0) {
      return "Out of Stock";
    }

    if (quantity <= reorderLevel) {
      return "Low Stock";
    }

    return "In Stock";
  };

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    "All Categories",
    ...new Set(
      products
        .map((product) => product.category)
        .filter((value) => value)
    )
  ];

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const productSearch =
        search.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(productSearch) ||
        product.category
          ?.toLowerCase()
          .includes(productSearch) ||
        product.description
          ?.toLowerCase()
          .includes(productSearch);

      const matchesCategory =
        category === "All Categories" ||
        product.category === category;

      const status = getStatus(product.id);

      const matchesStock =
        stockFilter === "All Stock" ||
        status === stockFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    }
  );

  // ==========================================
  // ADD PRODUCT MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      category: "",
      description: "",
      price: ""
    });

    setShowModal(true);
  };

  // ==========================================
  // EDIT PRODUCT MODAL
  // ==========================================

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      price: product.price ?? ""
    });

    setShowModal(true);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter category.");
      return;
    }

    if (
      !form.price ||
      Number(form.price) < 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      price: Number(form.price)
    };

    try {
      let response;

      if (editingProduct) {
        response = await fetch(
          `${PRODUCT_API}/${editingProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify(productData)
          }
        );
      } else {
        response = await fetch(
          PRODUCT_API,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify(productData)
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      alert(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setShowModal(false);
      setEditingProduct(null);

      setForm({
        name: "",
        category: "",
        description: "",
        price: ""
      });

      await fetchData();

    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      alert(
        "Unable to save product."
      );
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response =
        await fetch(
          `${PRODUCT_API}/${id}`,
          {
            method: "DELETE"
          }
        );

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      alert(
        "Product deleted successfully."
      );

      await fetchData();

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        "Unable to delete product."
      );
    }
  };

  // ==========================================
  // PRODUCT INITIAL
  // ==========================================

  const getInitial = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);

    setForm({
      name: "",
      category: "",
      description: "",
      price: ""
    });
  };

  return (
    <div className="dashboard-page">

      {/* ======================================
          SIDEBAR
          ====================================== */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-mark">
            O
          </div>

          <div>
            <h2>OMNISTOCK</h2>
            <span>
              Retail Management
            </span>
          </div>

        </div>

        {/* MENU TITLE */}

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span className="nav-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/account")
            }
          >
            <span className="nav-icon">
              ◉
            </span>

            <span>
              Account
            </span>
          </button>

          <button className="active">
            <span className="nav-icon">
              ▦
            </span>

            <span>
              Products
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/inventory")
            }
          >
            <span className="nav-icon">
              ▤
            </span>

            <span>
              Inventory
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/orders")
            }
          >
            <span className="nav-icon">
              ◫
            </span>

            <span>
              Orders
            </span>
          </button>

          <button
            onClick={() =>
              navigate("/reports")
            }
          >
            <span className="nav-icon">
              ◒
            </span>

            <span>
              Reports
            </span>
          </button>

        </nav>

        {/* BOTTOM */}

        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <strong>
                System Online
              </strong>

              <small>
                All services connected
              </small>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="nav-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN CONTENT
          ====================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>
              Product Catalog
            </h1>

            <p>
              {filteredProducts.length}
              {" "}
              products found
            </p>
          </div>

          <button
            className="add-product-button"
            onClick={openAddModal}
          >
            + Add Product
          </button>

        </header>

        {/* ==================================
            PRODUCT PANEL
            ================================== */}

        <section className="products-panel">

          <div className="products-header">

            <div className="product-filters">

              {/* SEARCH */}

              <div className="product-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search products ..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* CATEGORY */}

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              {/* STOCK */}

              <select
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(
                    e.target.value
                  )
                }
              >

                <option value="All Stock">
                  All Stock
                </option>

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Low Stock">
                  Low Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

              </select>

            </div>

          </div>

          {/* ==================================
              TABLE
              ================================== */}

          {loading ? (

            <div
              style={{
                padding: "40px",
                textAlign: "center"
              }}
            >
              Loading products...
            </div>

          ) : (

            <div className="products-table-wrapper">

              <table className="products-table">

                <thead>

                  <tr>

                    <th>
                      PRODUCT
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      PRICE
                    </th>

                    <th>
                      STOCK
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      LAST UPDATED
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "40px"
                        }}
                      >
                        No products found.
                      </td>

                    </tr>

                  ) : (

                    filteredProducts.map(
                      (product) => {

                        const quantity =
                          getQuantity(
                            product.id
                          );

                        const status =
                          getStatus(
                            product.id
                          );

                        const inventoryItem =
                          getInventory(
                            product.id
                          );

                        return (

                          <tr
                            key={
                              product.id
                            }
                          >

                            {/* PRODUCT */}

                            <td>

                              <div className="product-name">

                                <div className="product-avatar">

                                  {getInitial(
                                    product.name
                                  )}

                                </div>

                                <div>

                                  <strong>

                                    {product.name ||
                                      "Unnamed Product"}

                                  </strong>

                                  <small>

                                    ID:{" "}
                                    {product.id}

                                  </small>

                                </div>

                              </div>

                            </td>

                            {/* CATEGORY */}

                            <td>

                              {product.category ||
                                "-"}

                            </td>

                            {/* PRICE */}

                            <td>

                              ₹
                              {Number(
                                product.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </td>

                            {/* STOCK */}

                            <td>

                              <strong>
                                {quantity}
                              </strong>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={
                                  `product-status ${
                                    status ===
                                    "In Stock"
                                      ? "in-stock"
                                      : status ===
                                        "Low Stock"
                                      ? "low-stock"
                                      : "out-of-stock"
                                  }`
                                }
                              >
                                {status}
                              </span>

                            </td>

                            {/* LAST UPDATED */}

                            <td>

                              {inventoryItem
                                ? "22 Sept 2026"
                                : "22 Sept 2026"}

                            </td>

                            {/* ACTION */}

                            <td>

                              <div className="product-actions">

                                <button
                                  onClick={() =>
                                    openEditModal(
                                      product
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    deleteProduct(
                                      product.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>

                        );

                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ==================================
            FOOTER
            ================================== */}

        <footer className="dashboard-footer">

          <span>
            OmniStock
          </span>

          <span>
            Retail Management Platform
          </span>

          <span>
            • System Online
          </span>

          <span>
            • Inventory Synced
          </span>

        </footer>

      </main>

      {/* ======================================
          ADD / EDIT MODAL
          ====================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information"
                    : "Add a new product to your catalog"}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={saveProduct}
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="3"
                />

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >

                <button
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;