import { ArrowRightIcon, ArrowUpRightIcon } from "./Icons";

function Hero({ scrollToSection }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Curated technology
        </p>

        <h1>
          Better products.
          <br />
          <em>Better everyday.</em>
        </h1>

        <p className="hero-copy">
          Thoughtfully selected technology and accessories designed to
          make work, play, and everyday life feel a little better.
        </p>

        <div className="hero-actions">
          <button
            className="button button-dark"
            type="button"
            onClick={() => scrollToSection("shop")}
          >
            Shop collection
            <ArrowUpRightIcon />
          </button>

          <button
            className="text-button"
            type="button"
            onClick={() => scrollToSection("categories")}
          >
            Explore categories
            <ArrowRightIcon />
          </button>
        </div>

        <div className="hero-meta">
          <div>
            <strong>01</strong>
            <span>Curated selection</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Secure checkout</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Fast delivery</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-frame">
          <img
            src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1400&q=90"
            alt="Premium headphones"
          />

          <div className="hero-product-card">
            <div>
              <span>Featured</span>
              <strong>Wireless Headphones</strong>
            </div>

            <span>$49.99</span>
          </div>
        </div>

        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
      </div>
    </section>
  );
}

export default Hero;