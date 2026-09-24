import { useEffect, useState } from "react";

import "./App.css";

import {
  getCart,
  addCartItem,
} from "./api/cart";

import {
  isAuthenticated,
} from "./api/authStorage";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import InfoPage from "./pages/InfoPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

import { getProducts } from "./api/products";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [isLoadingProducts, setIsLoadingProducts] =
    useState(true);

  const [productsError, setProductsError] =
    useState("");

  /*
   * Load products once.
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoadingProducts(true);
        setProductsError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        setProductsError(
          error.message ||
            "Unable to load products.",
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  /*
   * Load the authenticated user's cart.
   *
   * Running this when the route changes also means
   * that after login -> "/" the cart is loaded again.
   */
  useEffect(() => {
    async function loadCart() {
      if (!isAuthenticated()) {
        setCart(null);
        setCartCount(0);
        return;
      }

      try {
        const data = await getCart();

        setCart(data);

        const items = Array.isArray(data?.items)
          ? data.items
          : [];

        const totalQuantity = items.reduce(
          (total, item) =>
            total + Number(item.quantity || 0),
          0,
        );

        setCartCount(totalQuantity);
      } catch (error) {
        console.error(
          "Unable to load cart:",
          error,
        );
      }
    }

    loadCart();
  }, [location.pathname]);

  /*
   * Add a real item to the Django cart.
   */
  const addToCart = async (product, quantity = 1) => {
  if (!product) return false;

  if (!isAuthenticated()) {
    setToast(
      "Please sign in to add items to your cart.",
    );

    window.clearTimeout(window.addToCartToast);

    window.addToCartToast = window.setTimeout(() => {
      setToast("");
    }, 2500);

    navigate("/login", {
      state: {
        from: location.pathname,
      },
    });

    return false;
  }

  try {
    await addCartItem(product.id, quantity);

    const updatedCart = await getCart();

    setCart(updatedCart);

    const items = Array.isArray(updatedCart?.items)
      ? updatedCart.items
      : [];

    const totalQuantity = items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0,
    );

    setCartCount(totalQuantity);

    setToast(
      quantity > 1
        ? `${product.name} (${quantity}) added to cart`
        : `${product.name} added to cart`,
    );

    window.clearTimeout(window.addToCartToast);

    window.addToCartToast = window.setTimeout(() => {
      setToast("");
    }, 2500);

    return true;
  } catch (error) {
    setToast(
      error.message ||
        "Unable to add this product to your cart.",
    );

    window.clearTimeout(window.addToCartToast);

    window.addToCartToast = window.setTimeout(() => {
      setToast("");
    }, 3000);

    return false;
  }
};

  const scrollToSection = (id) => {
    /*
     * If we're not on the homepage, go home first.
     */
    if (location.pathname !== "/") {
      navigate("/");

      /*
       * Give React Router a moment to render the page.
       */
      window.setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
      
      return;
    }

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <div className="store-app">
      <Navbar
        cartCount={cartCount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollToSection={scrollToSection}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              isLoadingProducts={
                isLoadingProducts
              }
              productsError={
                productsError
              }
              addToCart={addToCart}
              scrollToSection={
                scrollToSection
              }
            />
          }
        />

        <Route
          path="/shop"
          element={
            <Products
              addToCart={addToCart}
            />
          }
        />

       <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />
        <Route
          path="/orders/:orderNumber"
          element={
            <OrderDetails />
          }
        />
      <Route
          path="/info/:page"
          element={
            <InfoPage />
          }
        />
        <Route
  path="/legal/:page"
  element={<InfoPage />}
/>
        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={<Cart />}
          />
   <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>

      <Footer
        scrollToSection={
          scrollToSection
        }
      />

      <Toast message={toast} />
    </div>
  );
}

export default App;