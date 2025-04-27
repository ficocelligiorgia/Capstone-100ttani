import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import AdminProductForm from "./AdminProductForm";
import CartDrawer from "./CartDrawer";
import { FiShoppingCart } from "react-icons/fi";
import CheckoutPage from "./CheckoutPage";
import { useContext } from "react";
import { CartContext } from "./CartContext";

function Shop({ theme, token, userRole, onNotify }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { cartItems, addToCart } = useContext(CartContext);

  const isAdmin = userRole === "admin" || userRole === "staff";

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Errore nel recupero prodotti", err);
      onNotify?.("Errore nel recupero prodotti", "error");
    }
  }, [onNotify]);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      onNotify?.(" Prodotto eliminato", "success");
    } catch (err) {
      console.error("Errore nella cancellazione del prodotto:", err);
      onNotify?.(" Errore durante l'eliminazione", "error");
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]
        ? product.images[0].startsWith("http")
          ? product.images[0]
          : `http://localhost:5000${product.images[0]}`
        : "/images/placeholder.jpg",
    });
    setCartOpen(true);
  };

  const handleOrderComplete = () => {
    setCheckoutOpen(false);
    onNotify?.(" Ordine completato!", "success");
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setCartOpen(true)}
          title="Apri carrello"
          style={{
            backgroundColor: "crimson",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.4rem",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          <FiShoppingCart />
        </button>
      </div>

      {isAdmin && showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <AdminProductForm
            token={token}
            theme={theme}
            onProductCreated={() => {
              fetchProducts();
              setShowForm(false);
            }}
            onNotify={onNotify}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onSelect={setSelectedProduct}
              onDelete={handleDeleteProduct}
              userRole={userRole}
              theme={theme}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: theme.color }}>
            Nessun prodotto disponibile.
          </p>
        )}
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          theme={theme}
        />
      )}

      {isAdmin && (
        <button
          onClick={() => setShowForm(!showForm)}
          title="Aggiungi prodotto"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            backgroundColor: "crimson",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "2rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          +
        </button>
      )}

      {!checkoutOpen && (
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          theme={theme}
          isAuthenticated={!!token}
        />
      )}

      {checkoutOpen && (
        <CheckoutPage
          cartItems={cartItems}
          onBack={() => setCheckoutOpen(false)}
          onComplete={handleOrderComplete}
          theme={theme}
        />
      )}
    </div>
  );
}

export default Shop;
