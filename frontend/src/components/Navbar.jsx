import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router";

import {
  CartIcon,
  SearchIcon,
  UserIcon,
} from "./Icons";

import {
  getCurrentUser,
  logoutUser,
} from "../api/auth";

import {
  clearAuthToken,
  getAuthToken,
} from "../api/authStorage";

import { getProducts } from "../api/products";

function Navbar({
  cartCount,
  menuOpen,
  setMenuOpen,
  scrollToSection,
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] = useState("");
  const [searchProducts, setSearchProducts] =
    useState([]);
  const [isLoadingSearch, setIsLoadingSearch] =
    useState(false);

  const accountRef = useRef(null);
  const searchInputRef = useRef(null);
  const [mobileAccountOpen, setMobileAccountOpen] =
  useState(false);
  /*
   * Load current user
   */
  const loadUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const data = await getCurrentUser();

      setUser(data);
    } catch (error) {
      console.error(
        "Unable to load current user:",
        error,
      );

      clearAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /*
   * Keep Navbar synchronized with login/logout.
   */
  useEffect(() => {
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener(
      "nova-auth-change",
      handleAuthChange,
    );

    return () => {
      window.removeEventListener(
        "nova-auth-change",
        handleAuthChange,
      );
    };
  }, [loadUser]);

  /*
   * Close account menu when clicking outside.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  /*
   * Search products when search is opened.
   */
  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    let cancelled = false;

    async function loadSearchProducts() {
      try {
        setIsLoadingSearch(true);

        const data = await getProducts();

        if (!cancelled) {
          setSearchProducts(
            Array.isArray(data) ? data : [],
          );
        }
      } catch (error) {
        console.error(
          "Unable to load search products:",
          error,
        );

        if (!cancelled) {
          setSearchProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSearch(false);
        }
      }
    }

    loadSearchProducts();

    return () => {
      cancelled = true;
    };
  }, [searchOpen]);

  /*
   * Focus search input when opened.
   */
  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchOpen]);

  /*
   * Escape closes search.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logoutUser();
    } catch (error) {
      console.error(
        "Logout request failed:",
        error,
      );
    } finally {
      clearAuthToken();

      setUser(null);
      setAccountOpen(false);
      setMenuOpen(false);
      setIsLoggingOut(false);

      window.dispatchEvent(
        new Event("nova-auth-change"),
      );

      navigate("/");
    }
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate("/login");

      setMenuOpen(false);

      return;
    }

    setAccountOpen((open) => !open);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setAccountOpen(false);
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  const openSearchProduct = (productId) => {
    closeSearch();

    navigate(`/products/${productId}`);
  };

  const filteredSearchProducts = search.trim()
    ? searchProducts.filter((product) => {
        const query =
          search.trim().toLowerCase();

        return [
          product.name,
          product.description,
          product.category?.name,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query),
          );
      })
    : searchProducts.slice(0, 5);

  const displayName =
    user?.username ||
    user?.email ||
    "Account";

  return (
    <>
      <div className="announcement-bar">
        <p>Free shipping on orders over $50</p>

        <span aria-hidden="true">•</span>

        <p>
          Thoughtful products. Simple shopping.
        </p>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>

          <button
            type="button"
            className="brand"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
              closeSearch();
            }}
            aria-label="Go to NOVA home"
          >
            <span className="brand-mark">
              N
            </span>

            <span className="brand-name">
              NOVA
            </span>
          </button>

          <nav
            className={`main-nav ${
              menuOpen ? "is-open" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => {
                navigate("/shop");
                setMenuOpen(false);
                closeSearch();
              }}
            >
              Shop
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "categories",
                )
              }
            >
              Categories
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("featured")
              }
            >
              New arrivals
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection("about")
              }
            >
              About
            </button>
          </nav>
          
          <div className="header-actions">
            {/* SEARCH */}
            <button
              className={`icon-button ${
                searchOpen
                  ? "search-button-active"
                  : ""
              }`}
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <SearchIcon />
            </button>

            {/* ACCOUNT */}
            <div
              className="account-wrapper"
              ref={accountRef}
            >
              <button
                className="icon-button account-button"
                type="button"
                onClick={handleAccountClick}
                aria-label={
                  user
                    ? `Account: ${displayName}`
                    : "Sign in"
                }
                aria-expanded={
                  user
                    ? accountOpen
                    : undefined
                }
              >
                <UserIcon />

                {user && (
                  <span className="account-name">
                    {displayName}
                  </span>
                )}
              </button>

              {user && accountOpen && (
                <div className="account-menu">
                  <div className="account-menu-user">
                    <span>
                      Signed in as
                    </span>

                    <strong>
                      {displayName}
                    </strong>
                  </div>

                  <div className="account-menu-divider" />

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/orders");
                      setAccountOpen(false);
                    }}
                  >
                    My orders
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/cart");
                      setAccountOpen(false);
                    }}
                  >
                    Cart
                  </button>

                  <button
                    type="button"
                    className="account-logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut
                      ? "Signing out..."
                      : "Sign out"}
                  </button>
                </div>
              )}
            </div>

            {/* CART */}
            <button
              type="button"
              className="cart-button"
              onClick={() => {
                navigate("/cart");
                setMenuOpen(false);
                closeSearch();
              }}
              aria-label={`Open cart with ${cartCount} items`}
            >
              <CartIcon />

              <span className="cart-label">
                Cart
              </span>

              <span className="cart-count">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* SEARCH PANEL */}
        {searchOpen && (
          <div className="search-panel">
            <div className="search-panel-inner">
              <div className="search-panel-input">
                <SearchIcon />

                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search products..."
                  aria-label="Search products"
                />

                <button
                  type="button"
                  className="search-close"
                  onClick={closeSearch}
                  aria-label="Close search"
                >
                  ×
                </button>
              </div>

              <div className="search-results">
                {isLoadingSearch ? (
                  <div className="search-status">
                    Searching products...
                  </div>
                ) : filteredSearchProducts.length ===
                  0 ? (
                  <div className="search-status">
                    No products found.
                  </div>
                ) : (
                  <>
                    <div className="search-results-heading">
                      <span>
                        {search.trim()
                          ? "Search results"
                          : "Popular products"}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          closeSearch();
                          navigate("/shop");
                        }}
                      >
                        View all
                      </button>
                    </div>

                    <div className="search-result-list">
                      {filteredSearchProducts
                        .slice(0, 6)
                        .map((product) => {
                          const image =
                            product.image ||
                            "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80";

                          return (
                            <button
                              type="button"
                              className="search-result"
                              key={product.id}
                              onClick={() =>
                                openSearchProduct(
                                  product.id,
                                )
                              }
                            >
                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                              />

                              <span className="search-result-info">
                                <strong>
                                  {
                                    product.name
                                  }
                                </strong>

                                <small>
                                  {product
                                    .category
                                    ?.name ||
                                    "Collection"}
                                </small>
                              </span>

                              <strong className="search-result-price">
                                $
                                {Number(
                                  product.price,
                                ).toFixed(2)}
                              </strong>
                            </button>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;