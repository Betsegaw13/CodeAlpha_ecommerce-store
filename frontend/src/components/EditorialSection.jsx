import { ArrowRightIcon } from "./Icons";

function EditorialSection({ scrollToSection }) {
  return (
    <section id="about" className="editorial-section">
      <div className="editorial-image">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=90"
          alt="Modern workspace"
        />
      </div>

      <div className="editorial-content">
        <p className="section-kicker">
          The NOVA standard
        </p>

        <h2>
          Less clutter.
          <br />
          More intentional.
        </h2>

        <p>
          We believe the best technology quietly improves your day.
          That means carefully chosen products, straightforward
          information, and an experience that gets out of your way.
        </p>

        <button
          className="button button-outline"
          type="button"
          onClick={() => scrollToSection("shop")}
        >
          Discover the collection
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
}

export default EditorialSection;