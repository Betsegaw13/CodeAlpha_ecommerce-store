import {
  HeadphonesIcon,
  RefreshIcon,
  ShieldIcon,
  ShippingIcon,
} from "./Icons";

function FeatureStrip() {
  return (
    <section className="feature-strip" aria-label="Store benefits">
      <div>
        <ShippingIcon />
        <span>Free shipping over $50</span>
      </div>

      <div>
        <ShieldIcon />
        <span>Secure payments</span>
      </div>

      <div>
        <RefreshIcon />
        <span>Easy 30-day returns</span>
      </div>

      <div>
        <HeadphonesIcon />
        <span>Helpful support</span>
      </div>
    </section>
  );
}

export default FeatureStrip;