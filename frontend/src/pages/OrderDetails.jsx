import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getOrder } from "../api/orders";
import { isAuthenticated } from "../api/authStorage";

function OrderDetails() {
  const navigate = useNavigate();
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!isAuthenticated()) {
        navigate("/login", {
          state: {
            from: `/orders/${orderNumber}`,
          },
          replace: true,
        });

        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getOrder(orderNumber);

        setOrder(data);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load this order.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [navigate, orderNumber]);

  const actualOrder = order?.order || order;

  const items = useMemo(() => {
    if (Array.isArray(actualOrder?.items)) {
      return actualOrder.items;
    }

    if (Array.isArray(actualOrder?.order_items)) {
      return actualOrder.order_items;
    }

    return [];
  }, [actualOrder]);

  const orderId =
    actualOrder?.order_number ||
    actualOrder?.orderNumber ||
    orderNumber;

  const status = String(
    actualOrder?.status || "pending",
  ).toLowerCase();

  const subtotal = Number(
    actualOrder?.subtotal || 0,
  );

  const shipping = Number(
    actualOrder?.shipping || 0,
  );

  const tax = Number(
    actualOrder?.tax || 0,
  );

  const total = Number(
    actualOrder?.total || 0,
  );

  const createdAt =
    actualOrder?.created_at ||
    actualOrder?.createdAt;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "Date unavailable";

  if (isLoading) {
    return (
      <main className="order-details-page">
        <div className="order-details-loading">
          <div className="skeleton-line skeleton-small" />
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-medium" />

          <div className="order-details-loading-grid">
            <div className="skeleton-block" />
            <div className="skeleton-block" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !actualOrder) {
    return (
      <main className="order-details-page">
        <div className="products-message">
          <strong>
            {error || "Order not found."}
          </strong>

          <p>
            We couldn't find the order you're
            looking for.
          </p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/orders")}
          >
            Back to orders
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-top">
        <button
          type="button"
          className="back-to-orders"
          onClick={() => navigate("/orders")}
        >
          ← Back to orders
        </button>

        <div className="order-details-heading">
          <div>
            <p className="section-kicker">
              Order
            </p>

            <h1>{orderId}</h1>

            <p>
              Placed on {formattedDate}
            </p>
          </div>

          <span
            className={`order-status order-status-${status}`}
          >
            {status}
          </span>
        </div>
      </div>

      <section className="order-details-layout">
        <div className="order-details-main">
          <div className="order-details-section">
            <div className="order-details-section-title">
              <p className="section-kicker">
                Items
              </p>

              <h2>
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}
              </h2>
            </div>

            <div className="order-detail-items">
              {items.length === 0 ? (
                <p className="order-no-items">
                  No item details are available.
                </p>
              ) : (
                items.map((item, index) => {
                  const product =
                    item.product || {};

                  const productName =
                    item.product_name ||
                    product.name ||
                    item.name ||
                    "Product";

                  const image =
                    product.image ||
                    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

                  const quantity = Number(
                    item.quantity || 1,
                  );

                  const unitPrice = Number(
                    item.unit_price ||
                      product.price ||
                      0,
                  );

                  const itemSubtotal = Number(
                    item.subtotal ||
                      unitPrice * quantity,
                  );

                  return (
                    <article
                      className="order-detail-item"
                      key={
                        item.id ||
                        `${productName}-${index}`
                      }
                    >
                      <button
                        type="button"
                        className="order-detail-image"
                        onClick={() => {
                          if (product.id) {
                            navigate(
                              `/products/${product.id}`,
                            );
                          }
                        }}
                        disabled={!product.id}
                      >
                        <img
                          src={image}
                          alt={productName}
                        />
                      </button>

                      <div className="order-detail-item-info">
                        <div>
                          <p className="product-category">
                            {product.category
                              ?.name ||
                              "Collection"}
                          </p>

                          <h3>{productName}</h3>

                          <p>
                            ${unitPrice.toFixed(2)}{" "}
                            × {quantity}
                          </p>
                        </div>

                        <strong>
                          ${itemSubtotal.toFixed(2)}
                        </strong>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="order-details-section">
            <div className="order-details-section-title">
              <p className="section-kicker">
                Delivery
              </p>

              <h2>Shipping details</h2>
            </div>

            <div className="order-shipping-details">
              <div>
                <span>Name</span>
                <strong>
                  {actualOrder.full_name ||
                    actualOrder.shipping_name ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {actualOrder.email ||
                    actualOrder.shipping_email ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {actualOrder.phone ||
                    actualOrder.shipping_phone ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Address</span>
                <strong>
                  {actualOrder.address ||
                    actualOrder.shipping_address ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>City</span>
                <strong>
                  {actualOrder.city ||
                    actualOrder.shipping_city ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Country</span>
                <strong>
                  {actualOrder.country ||
                    actualOrder.shipping_country ||
                    "—"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <aside className="order-details-summary">
          <p className="section-kicker">
            Order summary
          </p>

          <h2>Payment summary</h2>

          <div className="order-summary-row">
            <span>Subtotal</span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="order-summary-row">
            <span>Shipping</span>

            <strong>
              ${shipping.toFixed(2)}
            </strong>
          </div>

          <div className="order-summary-row">
            <span>Tax</span>

            <strong>
              ${tax.toFixed(2)}
            </strong>
          </div>

          <div className="order-summary-divider" />

          <div className="order-summary-total">
            <span>Total</span>

            <strong>
              ${total.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Continue shopping
            <span aria-hidden="true">→</span>
          </button>
        </aside>
      </section>
    </main>
  );
}

export default OrderDetails;