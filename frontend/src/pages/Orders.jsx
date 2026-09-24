import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getOrders } from "../api/orders";
import { isAuthenticated } from "../api/authStorage";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated()) {
        navigate("/login", {
          state: {
            from: "/orders",
          },
          replace: true,
        });

        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getOrders();

        /*
         * Supports either:
         * [ ...orders ]
         * or { results: [ ...orders ] }
         * or { orders: [ ...orders ] }
         */
        const list = Array.isArray(data)
          ? data
          : data?.results ||
            data?.orders ||
            [];

        setOrders(list);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load your orders.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [navigate]);

  const getOrderNumber = (order) =>
    order.order_number ||
    order.orderNumber ||
    order.id ||
    "Order";

  const getOrderStatus = (order) =>
    String(order.status || "pending").toLowerCase();

  const getOrderDate = (order) => {
    const value =
      order.created_at ||
      order.createdAt ||
      order.date;

    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOrderTotal = (order) =>
    Number(
      order.total ||
        order.grand_total ||
        order.total_amount ||
        0,
    );

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.order_items)) {
      return order.order_items;
    }

    return [];
  };

  if (isLoading) {
    return (
      <main className="orders-page">
        <section className="orders-header">
          <p className="section-kicker">
            Account
          </p>

          <h1>Your orders.</h1>

          <p>
            Keep track of your previous purchases.
          </p>
        </section>

        <div className="orders-list">
          {[1, 2, 3].map((item) => (
            <article
              className="order-card order-card-skeleton"
              key={item}
            >
              <div className="skeleton-line skeleton-medium" />
              <div className="skeleton-line skeleton-small" />
              <div className="skeleton-line skeleton-price" />
            </article>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="products-message">
          <strong>
            We couldn't load your orders.
          </strong>

          <p>{error}</p>

          <button
            type="button"
            className="button button-dark"
            onClick={() =>
              window.location.reload()
            }
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <section className="orders-empty">
          <p className="section-kicker">
            Account
          </p>

          <h1>No orders yet.</h1>

          <p>
            Your completed purchases will appear here.
          </p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Start shopping
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <div>
          <p className="section-kicker">
            Account
          </p>

          <h1>Your orders.</h1>

          <p>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}{" "}
            in your history.
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

      <section className="orders-list">
        {orders.map((order) => {
          const items = getOrderItems(order);

          const status = getOrderStatus(order);

          return (
            <article
              className="order-card"
              key={getOrderNumber(order)}
            >
              <div className="order-card-top">
                <div>
                  <p className="section-kicker">
                    Order
                  </p>

                  <h2>
                    {getOrderNumber(order)}
                  </h2>
                </div>

                <span
                  className={`order-status order-status-${status}`}
                >
                  {status}
                </span>
              </div>

              <div className="order-card-meta">
                <span>
                  {getOrderDate(order)}
                </span>

                <strong>
                  ${getOrderTotal(order).toFixed(2)}
                </strong>
              </div>

              {items.length > 0 && (
                <div className="order-items-preview">
                  {items.slice(0, 3).map(
                    (item, index) => {
                      const name =
                        item.product_name ||
                        item.product?.name ||
                        item.name ||
                        "Product";

                      const quantity = Number(
                        item.quantity || 1,
                      );

                      return (
                        <div
                          className="order-item-preview"
                          key={
                            item.id ||
                            `${getOrderNumber(order)}-${index}`
                          }
                        >
                          <span>{name}</span>

                          <span>
                            × {quantity}
                          </span>
                        </div>
                      );
                    },
                  )}

                  {items.length > 3 && (
                    <span className="order-more-items">
                      + {items.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="order-card-bottom">
                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    navigate(
                      `/orders/${getOrderNumber(order)}`,
                    )
                  }
                >
                  View order
                  <span aria-hidden="true">
                    →
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Orders;