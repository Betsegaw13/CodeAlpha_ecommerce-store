import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../api/cart";

import { isAuthenticated } from "../api/authStorage";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] =
    useState(null);
  const [removingItemId, setRemovingItemId] =
    useState(null);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!isAuthenticated()) {
        navigate("/login", {
          state: {
            from: "/cart",
          },
          replace: true,
        });

        return;
      }

      const data = await getCart();

      setCart(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load your cart.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const items = Array.isArray(cart?.items)
    ? cart.items
    : [];

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + Number(item.subtotal || 0),
      0,
    );
  }, [items]);

  const handleQuantityChange = async (
    item,
    quantity,
  ) => {
    const maxStock = Number(
      item.product?.stock || quantity,
    );

    const nextQuantity = Math.max(
      1,
      Math.min(quantity, maxStock),
    );

    if (
      nextQuantity === Number(item.quantity) ||
      updatingItemId === item.id
    ) {
      return;
    }

    try {
      setUpdatingItemId(item.id);

      const updatedCart =
        await updateCartItem(
          item.id,
          nextQuantity,
        );

      setCart(updatedCart);
    } catch (err) {
      setError(
        err.message ||
          "Unable to update this item.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (item) => {
    if (removingItemId === item.id) {
      return;
    }

    try {
      setRemovingItemId(item.id);

      const updatedCart =
        await removeCartItem(item.id);

      setCart(updatedCart);
    } catch (err) {
      setError(
        err.message ||
          "Unable to remove this item.",
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="cart-page">
        <div className="cart-header">
          <div>
            <p className="section-kicker">
              Your bag
            </p>

            <h1>Your cart.</h1>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {[1, 2].map((item) => (
              <div
                className="cart-skeleton-item"
                key={item}
              >
                <div className="cart-skeleton-image skeleton-block" />

                <div className="cart-skeleton-content">
                  <div className="skeleton-line skeleton-small" />
                  <div className="skeleton-line skeleton-medium" />
                  <div className="skeleton-line skeleton-price" />
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary cart-summary-skeleton">
            <div className="skeleton-line skeleton-medium" />
            <div className="skeleton-line skeleton-price" />
            <div className="skeleton-line skeleton-price" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="products-message">
          <strong>
            We couldn't load your cart.
          </strong>

          <p>{error}</p>

          <button
            type="button"
            className="button button-dark"
            onClick={loadCart}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <p className="section-kicker">
            Your bag
          </p>

          <h1>Your cart is empty.</h1>

          <p>
            Discover something you'll love and add
            it to your cart.
          </p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Continue shopping
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <div>
          <p className="section-kicker">
            Your bag
          </p>

          <h1>Your cart.</h1>

          <p>
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}{" "}
            ready for checkout.
          </p>
        </div>

        <button
          type="button"
          className="text-button"
          onClick={() => navigate("/shop")}
        >
          Continue shopping
          <span aria-hidden="true">→</span>
        </button>
      </section>

      {error && (
        <div className="cart-inline-error">
          {error}
        </div>
      )}

      <section className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const product = item.product || {};

            const image =
              product.image ||
              "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

            const stock = Number(
              product.stock || item.quantity,
            );

            const quantity = Number(
              item.quantity || 1,
            );

            const isUpdating =
              updatingItemId === item.id;

            const isRemoving =
              removingItemId === item.id;

            return (
              <article
                className="cart-item"
                key={item.id}
              >
                <button
                  type="button"
                  className="cart-item-image-button"
                  onClick={() =>
                    navigate(
                      `/products/${product.id}`,
                    )
                  }
                  aria-label={`View ${item.product_name || product.name}`}
                >
                  <img
                    src={image}
                    alt={
                      item.product_name ||
                      product.name
                    }
                  />
                </button>

                <div className="cart-item-content">
                  <div className="cart-item-main">
                    <div>
                      <p className="product-category">
                        {product.category?.name ||
                          "Collection"}
                      </p>

                      <h2>
                        {item.product_name ||
                          product.name ||
                          "Product"}
                      </h2>

                      <p className="cart-item-price">
                        $
                        {Number(
                          item.unit_price ||
                            product.price ||
                            0,
                        ).toFixed(2)}
                      </p>
                    </div>

                    <strong className="cart-item-subtotal">
                      $
                      {Number(
                        item.subtotal || 0,
                      ).toFixed(2)}
                    </strong>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity">
                      <button
                        type="button"
                        disabled={
                          quantity <= 1 ||
                          isUpdating ||
                          isRemoving
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity - 1,
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>
                        {isUpdating
                          ? "..."
                          : quantity}
                      </span>

                      <button
                        type="button"
                        disabled={
                          quantity >= stock ||
                          isUpdating ||
                          isRemoving
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity + 1,
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove"
                      disabled={isRemoving}
                      onClick={() =>
                        handleRemove(item)
                      }
                    >
                      {isRemoving
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <p className="section-kicker">
            Order summary
          </p>

          <h2>Ready when you are.</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>

            <span>Calculated at checkout</span>
          </div>

          <div className="cart-summary-divider" />

          <div className="cart-total">
            <span>Total</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="button button-dark cart-checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
            <span aria-hidden="true">→</span>
          </button>

          <p className="cart-summary-note">
            Secure checkout. Your order will be
            processed through NOVA.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Cart;