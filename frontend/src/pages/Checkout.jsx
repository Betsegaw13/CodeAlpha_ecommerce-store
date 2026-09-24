import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { getCart } from "../api/cart";
import { checkoutOrder } from "../api/orders";
import { isAuthenticated } from "../api/authStorage";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [isLoadingCart, setIsLoadingCart] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [orderNumber, setOrderNumber] =
    useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  useEffect(() => {
    async function loadCart() {
      if (!isAuthenticated()) {
        navigate("/login", {
          state: {
            from: "/checkout",
          },
          replace: true,
        });

        return;
      }

      try {
        setIsLoadingCart(true);
        setError("");

        const data = await getCart();

        setCart(data);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load your cart.",
        );
      } finally {
        setIsLoadingCart(false);
      }
    }

    loadCart();
  }, [navigate]);

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

  const shipping = items.length > 0 ? 10 : 0;

  const tax = 0;

  const total = subtotal + shipping + tax;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setError(
        "Your cart is empty. Add a product before checkout.",
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const result = await checkoutOrder(form);

      /*
       * Django returns:
       *
       * {
       *   "message": "...",
       *   "order": {
       *      "order_number": "..."
       *   }
       * }
       */

      const createdOrderNumber =
        result?.order?.order_number ||
        result?.order?.orderNumber ||
        result?.order_number ||
        result?.orderNumber ||
        result?.order?.id ||
        result?.id;

      if (!createdOrderNumber) {
        throw new Error(
          "Your order was created, but no order number was returned.",
        );
      }

      setOrderNumber(
        String(createdOrderNumber),
      );
    } catch (err) {
      setError(
        err.message ||
          "We couldn't place your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <div className="checkout-success-icon">
            ✓
          </div>

          <p className="section-kicker">
            Order confirmed
          </p>

          <h1>Thank you.</h1>

          <p>
            Your order has been successfully placed.
          </p>

          <div className="checkout-order-number">
            <span>Order number</span>

            <strong>{orderNumber}</strong>
          </div>

          <p className="checkout-success-note">
            Keep this number for your records.
          </p>

          <div className="checkout-success-actions">
            <button
              type="button"
              className="button button-dark"
              onClick={() => navigate("/")}
            >
              Back to home
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/shop")}
            >
              Continue shopping
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/orders")}
            >
              View orders
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (isLoadingCart) {
    return (
      <main className="checkout-page">
        <div className="checkout-header">
          <p className="section-kicker">
            Checkout
          </p>

          <h1>Complete your order.</h1>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form checkout-skeleton">
            <div className="skeleton-line skeleton-medium" />

            <div className="skeleton-line checkout-skeleton-input" />

            <div className="skeleton-line checkout-skeleton-input" />

            <div className="skeleton-line checkout-skeleton-input" />

            <div className="skeleton-line checkout-skeleton-input" />
          </div>

          <aside className="checkout-summary">
            <div className="skeleton-line skeleton-medium" />

            <div className="skeleton-line checkout-skeleton-input" />

            <div className="skeleton-line checkout-skeleton-input" />
          </aside>
        </div>
      </main>
    );
  }

  if (!error && items.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <p className="section-kicker">
            Checkout
          </p>

          <h1>Your cart is empty.</h1>

          <p>
            Add something to your cart before
            continuing to checkout.
          </p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Browse shop
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <p className="section-kicker">
          Checkout
        </p>

        <h1>Complete your order.</h1>

        <p>
          Enter your delivery details. No payment is
          required for this assignment.
        </p>
      </section>

      {error && (
        <div
          className="checkout-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <div className="checkout-form-section">
            <div className="checkout-section-heading">
              <span>01</span>

              <div>
                <p className="section-kicker">
                  Contact
                </p>

                <h2>Your details</h2>
              </div>
            </div>

            <div className="checkout-fields">
              <label>
                <span>Full name</span>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span>Email</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>Phone</span>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                  required
                />
              </label>
            </div>
          </div>

          <div className="checkout-form-section">
            <div className="checkout-section-heading">
              <span>02</span>

              <div>
                <p className="section-kicker">
                  Delivery
                </p>

                <h2>Shipping address</h2>
              </div>
            </div>

            <div className="checkout-fields">
              <label className="checkout-field-full">
                <span>Address</span>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label>
                <span>City</span>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </label>

              <label>
                <span>State</span>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State / region"
                  autoComplete="address-level1"
                />
              </label>

              <label>
                <span>Postal code</span>

                <input
                  type="text"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  placeholder="Postal code"
                  autoComplete="postal-code"
                />
              </label>

              <label>
                <span>Country</span>

                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  autoComplete="country-name"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="button button-dark checkout-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing order..."
              : "Place order"}

            <span aria-hidden="true">→</span>
          </button>
        </form>

        <aside className="checkout-summary">
          <p className="section-kicker">
            Your order
          </p>

          <h2>
            {items.length}{" "}
            {items.length === 1
              ? "item"
              : "items"}
          </h2>

          <div className="checkout-summary-items">
            {items.map((item) => (
              <div
                className="checkout-summary-item"
                key={item.id}
              >
                <span>
                  {item.product_name} ×{" "}
                  {item.quantity}
                </span>

                <strong>
                  $
                  {Number(
                    item.subtotal || 0,
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-summary-item">
            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="checkout-summary-item">
            <span>Shipping</span>

            <strong>
              ${shipping.toFixed(2)}
            </strong>
          </div>

          <div className="checkout-summary-item">
            <span>Tax</span>

            <strong>
              ${tax.toFixed(2)}
            </strong>
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ${total.toFixed(2)}
            </strong>
          </div>

          <p className="checkout-note">
            Payment processing is not required for
            this store assignment.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;