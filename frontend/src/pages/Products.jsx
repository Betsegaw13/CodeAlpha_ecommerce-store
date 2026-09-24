import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router";

import {
  getCategories,
  getProducts,
} from "../api/products";

import {
  HeartIcon,
  PlusIcon,
  SearchIcon,
} from "../components/Icons";

function Products({ addToCart }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingProductId, setAddingProductId] =
    useState(null);

  const [addedProductId, setAddedProductId] =
    useState(null);

  useEffect(() => {
    async function loadStore() {
      try {
        setIsLoading(true);
        setError("");

        const [productsData, categoriesData] =
          await Promise.all([
            getProducts(),
            getCategories(),
          ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(
          err.message ||
            "We couldn't load the shop.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStore();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        [
          product.name,
          product.description,
          product.category?.name,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query),
          ),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          String(product.category?.id) ===
          selectedCategory,
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price),
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price),
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sortBy,
  ]);

  const openProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleQuickAdd = async (product) => {
    if (
      product.stock < 1 ||
      addingProductId === product.id
    ) {
      return;
    }

    setAddingProductId(product.id);
    setAddedProductId(null);

    const success = await addToCart(product);

    setAddingProductId(null);

    if (success) {
      setAddedProductId(product.id);

      window.setTimeout(() => {
        setAddedProductId((current) =>
          current === product.id
            ? null
            : current,
        );
      }, 1600);
    }
  };

  return (
    <main className="shop-page">
      <section className="shop-header">
        <div>
          <p className="section-kicker">
            Collection
          </p>

          <h1>Everything worth having.</h1>

          <p className="shop-intro">
            Explore thoughtfully selected technology
            and everyday essentials.
          </p>
        </div>

        <span className="product-count">
          {filteredProducts.length} products
        </span>
      </section>

      <section className="shop-toolbar">
        <label className="shop-search">
          <SearchIcon />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products"
            aria-label="Search products"
          />
        </label>

        <div className="shop-controls">
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(
                event.target.value,
              )
            }
            aria-label="Filter by category"
          >
            <option value="all">
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={String(category.id)}
              >
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            aria-label="Sort products"
          >
            <option value="featured">
              Featured
            </option>

            <option value="name">
              Name
            </option>

            <option value="price-low">
              Price: low to high
            </option>

            <option value="price-high">
              Price: high to low
            </option>
          </select>
        </div>
      </section>

      {isLoading && (
        <div className="shop-grid">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <article
                className="product-card product-card-skeleton"
                key={index}
              >
                <div className="product-image-wrap skeleton-block" />

                <div className="product-details">
                  <div>
                    <div className="skeleton-line skeleton-small" />
                    <div className="skeleton-line skeleton-medium" />
                  </div>

                  <div className="skeleton-line skeleton-price" />
                </div>
              </article>
            ),
          )}
        </div>
      )}

      {!isLoading && error && (
        <div className="products-message">
          <strong>
            We couldn't load the shop.
          </strong>

          <p>{error}</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="products-message">
            <strong>
              No matching products.
            </strong>

            <p>
              Try another search or category.
            </p>
          </div>
        )}

      {!isLoading &&
        !error &&
        filteredProducts.length > 0 && (
          <div className="shop-grid">
            {filteredProducts.map((product) => {
              const isAvailable =
                Number(product.stock) > 0;

              const isAdding =
                addingProductId === product.id;

              const wasAdded =
                addedProductId === product.id;

              const image =
                product.image ||
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";

              return (
                <article
                  className="product-card"
                  key={product.id}
                  role="link"
                  tabIndex={0}
                  onClick={() =>
                    openProduct(product.id)
                  }
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
                    />

                    <span className="product-badge">
                      {isAvailable
                        ? "Available"
                        : "Sold out"}
                    </span>

                    <button
                      className="quick-action"
                      type="button"
                      aria-label={`Add ${product.name} to wishlist`}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <HeartIcon />
                    </button>

                    <button
                      className={`quick-add ${
                        wasAdded
                          ? "quick-add-success"
                          : ""
                      }`}
                      type="button"
                      disabled={
                        !isAvailable ||
                        isAdding ||
                        wasAdded
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handleQuickAdd(product);
                      }}
                    >
                      {isAdding ? (
                        <>
                          Adding...
                        </>
                      ) : wasAdded ? (
                        <>
                          Added
                          <span
                            className="quick-add-check"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        </>
                      ) : (
                        <>
                          Quick add
                          <PlusIcon />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="product-details">
                    <div>
                      <p className="product-category">
                        {product.category?.name ||
                          "Collection"}
                      </p>

                      <h3>{product.name}</h3>
                    </div>

                    <div className="product-price">
                      <strong>
                        $
                        {Number(
                          product.price,
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </main>
  );
}

export default Products;