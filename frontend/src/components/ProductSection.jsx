import { useNavigate } from "react-router";
import { PlusIcon } from "../components/Icons";

function ProductSection({
  products = [],
  isLoadingProducts = false,
  productsError = "",
  addToCart,
}) {
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 4);

  const openProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section
      className="content-section products-section"
      id="products"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            Featured collection
          </p>

          <h2>Selected for you.</h2>
        </div>

        <button
          type="button"
          className="text-button desktop-section-link"
          onClick={() => navigate("/shop")}
        >
          View all products
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {isLoadingProducts ? (
        <div className="product-grid">
          {[1, 2, 3, 4].map((item) => (
            <article
              className="product-card product-card-skeleton"
              key={item}
            >
              <div className="product-image-wrap">
                <div className="skeleton-block" />
              </div>

              <div className="product-details">
                <div>
                  <div className="skeleton-line skeleton-small" />
                  <div className="skeleton-line skeleton-medium" />
                </div>

                <div className="product-price">
                  <div className="skeleton-line skeleton-price" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : productsError ? (
        <div className="products-message">
          <strong>Unable to load products</strong>

          <p>{productsError}</p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Browse shop
          </button>
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className="products-message">
          <strong>No products available</strong>

          <p>
            Products will appear here once they are available
            from the store API.
          </p>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/shop")}
          >
            Browse shop
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {featuredProducts.map((product) => {
            const image =
              product.image ||
              "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85";

            const categoryName =
              product.category?.name ||
              product.category_name ||
              "Collection";

            const isAvailable =
              Number(product.stock) > 0;

            return (
              <article
                className="product-card"
                key={product.id}
                role="link"
                tabIndex={0}
                onClick={() => openProduct(product.id)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    openProduct(product.id);
                  }
                }}
              >
                <div className="product-image-wrap">
                  <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                  />

                  <span className="product-badge">
                    Featured
                  </span>

                  <button
                    type="button"
                    className="quick-action"
                    aria-label={`View ${product.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openProduct(product.id);
                    }}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="quick-add"
                    disabled={!isAvailable}
                    onClick={(event) => {
                      event.stopPropagation();

                      if (isAvailable) {
                        addToCart(product);
                      }
                    }}
                  >
                    <PlusIcon />

                    {isAvailable
                      ? "Add to cart"
                      : "Out of stock"}
                  </button>
                </div>

                <div className="product-details">
                  <div>
                    <p className="product-category">
                      {categoryName}
                    </p>

                    <h3>{product.name}</h3>
                  </div>

                  <div className="product-price">
                    <strong>
                      ${Number(product.price).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductSection;