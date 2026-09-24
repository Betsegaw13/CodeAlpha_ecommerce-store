import { useNavigate } from "react-router";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
} from "./Icons";

const categories = [
  {
    name: "Audio",
    description: "Sound for every moment",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Workspace",
    description: "Build a better setup",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Wearables",
    description: "Technology that moves",
    image:
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1000&q=85",
  },
];

function CategorySection() {
  const navigate = useNavigate();

  const goToShop = () => {
    navigate("/shop");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="categories"
      className="content-section categories-section"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            Explore
          </p>

          <h2>Shop by category</h2>
        </div>

        <button
          className="text-button desktop-section-link"
          type="button"
          onClick={goToShop}
        >
          View all
          <ArrowRightIcon />
        </button>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => (
          <button
            className="category-card"
            type="button"
            key={category.name}
            onClick={goToShop}
            aria-label={`Browse ${category.name}`}
          >
            <img
              src={category.image}
              alt={category.name}
            />

            <div className="category-overlay" />

            <div className="category-info">
              <span>
                0{index + 1}
              </span>

              <div>
                <strong>
                  {category.name}
                </strong>

                <p>
                  {category.description}
                </p>
              </div>

              <ArrowUpRightIcon />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;