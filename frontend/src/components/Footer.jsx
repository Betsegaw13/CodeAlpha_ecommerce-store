import { useNavigate } from "react-router";

function Footer({ scrollToSection }) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToShop = () => {
    navigate("/shop");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToSection = (id) => {
    scrollToSection(id);
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <button
            className="brand footer-brand-button"
            type="button"
            onClick={goHome}
            aria-label="Go to NOVA home"
          >
            <span className="brand-mark">N</span>

            <span className="brand-name">
              NOVA
            </span>
          </button>

          <p>
            Thoughtful technology for
            <br />
            everyday life.
          </p>
        </div>

        <div className="footer-column">
          <span>Shop</span>

          <button
            type="button"
            onClick={goToShop}
          >
            All products
          </button>

        

          <button
            type="button"
            onClick={() =>
              goToSection("categories")
            }
          >
            Categories
          </button>
        </div>

       

        <div className="footer-column">
          <span>Account</span>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
          >
            My orders
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
          >
            Cart
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 NOVA. All rights reserved.
        </span>

        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/legal/privacy")
            }
          >
            Privacy
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/legal/terms")
            }
          >
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;