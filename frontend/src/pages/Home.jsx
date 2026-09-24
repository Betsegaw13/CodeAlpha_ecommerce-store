import Hero from "../components/Hero";
import FeatureStrip from "../components/FeatureStrip";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import EditorialSection from "../components/EditorialSection";

function Home({
  products,
  isLoadingProducts,
  productsError,
  addToCart,
  scrollToSection,
}) {
  return (
    <main id="top">
      <Hero scrollToSection={scrollToSection} />

      <FeatureStrip />

      <CategorySection scrollToSection={scrollToSection} />

      <ProductSection
        products={products}
        isLoadingProducts={isLoadingProducts}
        productsError={productsError}
        addToCart={addToCart}
        scrollToSection={scrollToSection}
      />

      <EditorialSection
        scrollToSection={scrollToSection}
      />
    </main>
  );
}

export default Home;