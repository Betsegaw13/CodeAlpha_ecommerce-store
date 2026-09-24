import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getProduct } from "../api/products";

import {
  ArrowLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ShippingIcon,
  ShieldIcon,
} from "../components/Icons";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProduct(id);

        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(
          err.message || "We couldn't load this product.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((current) =>
      Math.min(current + 1, product.stock),
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1),
    );
  };

  const handleAddToCart = () => {
    if (!product || product.stock < 1) return;

    addToCart(product);

    setQuantity(1);
  };

  if (isLoading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <div className="product-details-skeleton-image skeleton-block" />

          <div className="product-details-skeleton-content">
            <div className="skeleton-line skeleton-small" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-title-short" />
            <div className="skeleton-line skeleton-description" />
            <div className="skeleton-line skeleton-description" />
            <div className="skeleton-line skeleton-price-large" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="products-message">
          <strong>
            {error || "Product not found."}
          </strong>

          <p>
            This product may have been removed or is no
            longer available.
          </p>

          <button
            className="button button-dark"
            type="button"
            onClick={() => navigate("/shop")}
          >
            Back to shop
            <ArrowLeftIcon />
          </button>
        </div>
      </main>
    );
  }

  const isAvailable = product.stock > 0;

  return (
    <main className="product-details-page">
      <div className="product-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/shop")}
        >
          Shop
        </button>

        <span>/</span>

        <span>{product.category?.name || "Collection"}</span>

        <span>/</span>

        <span>{product.name}</span>
      </div>

      <button
        className="back-to-shop"
        type="button"
        onClick={() => navigate("/shop")}
      >
        <ArrowLeftIcon />
        Back to shop
      </button>

      <section className="product-detail-layout">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            <img
              src={
                product.image ||
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=90"
              }
              alt={product.name}
            />

            {!isAvailable && (
              <span className="product-detail-sold-out">
                Sold out
              </span>
            )}
          </div>
        </div>

        <div className="product-detail-info">
          <p className="product-category">
            {product.category?.name || "Collection"}
          </p>

          <h1>{product.name}</h1>

          <div className="product-detail-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <div
            className={`stock-status ${
              isAvailable ? "is-available" : "is-unavailable"
            }`}
          >
            <span />

            {isAvailable
              ? `${product.stock} available`
              : "Currently unavailable"}
          </div>

          <div className="product-detail-divider" />

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="purchase-area">
            <div className="quantity-control">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!isAvailable || quantity <= 1}
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  !isAvailable ||
                  quantity >= product.stock
                }
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>

            <button
              className="button button-dark add-to-cart-detail"
              type="button"
              disabled={!isAvailable}
              onClick={handleAddToCart}
            >
              {isAvailable
                ? "Add to cart"
                : "Out of stock"}

              {isAvailable && <PlusIcon />}
            </button>
          </div>

          <div className="product-benefits">
            <div>
              <ShippingIcon />

              <div>
                <strong>Fast delivery</strong>
                <span>
                  Carefully packed and shipped quickly.
                </span>
              </div>
            </div>

            <div>
              <ShieldIcon />

              <div>
                <strong>Secure checkout</strong>
                <span>
                  Your information stays protected.
                </span>
              </div>
            </div>

            <div>
              <CheckIcon />

              <div>
                <strong>Easy returns</strong>
                <span>
                  Simple 30-day return policy.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-information-section">
        <div>
          <p className="section-kicker">Product information</p>
          <h2>Designed for everyday use.</h2>
        </div>

        <p>
          {product.description}
        </p>
      </section>
    </main>
  );
}

export default ProductDetails;