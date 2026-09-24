import { useNavigate, useParams } from "react-router";

const pageContent = {
  contact: {
    kicker: "Support",
    title: "Let's talk.",
    intro:
      "Have a question about an order, delivery, return, or product? Use the information below to find the right place to start.",
    sections: [
      {
        title: "Orders",
        text:
          "For questions about an order you've already placed, open your Orders page and select the relevant order to review its details.",
      },
      {
        title: "Product questions",
        text:
          "Open any product from the Shop to see its price, stock availability, description, and purchase options.",
      },
      {
        title: "Account",
        text:
          "Use the account menu in the navigation bar to access your orders, cart, or sign out.",
      },
    ],
  },

  shipping: {
    kicker: "Support",
    title: "Shipping.",
    intro:
      "NOVA keeps shipping simple. Delivery details are collected during checkout and attached to your order.",
    sections: [
      {
        title: "Shipping information",
        text:
          "Enter your full name, phone number, address, city, state, postal code, and country during checkout.",
      },
      {
        title: "Order processing",
        text:
          "After you place an order, it appears in your account under Orders with its current status.",
      },
      {
        title: "Delivery timing",
        text:
          "Delivery timing can vary by destination and order status. Check your order details for the latest information available.",
      },
    ],
  },

  returns: {
    kicker: "Support",
    title: "Returns.",
    intro:
      "We aim to keep the return experience straightforward.",
    sections: [
      {
        title: "Before requesting a return",
        text:
          "Review your order details first and make sure the product and order information are correct.",
      },
      {
        title: "Return information",
        text:
          "Return handling is not automated in this demo store. Contact the store operator with your order number for return assistance.",
      },
      {
        title: "Order number",
        text:
          "Your order number is available on the order confirmation screen and in your Orders page.",
      },
    ],
  },

  faq: {
    kicker: "Support",
    title: "Questions, answered.",
    intro:
      "Here are answers to the most common questions about using NOVA.",
    sections: [
      {
        title: "Do I need an account?",
        text:
          "Yes. An account is required to add products to the persistent cart and complete checkout.",
      },
      {
        title: "Do I need to pay online?",
        text:
          "No. This CodeAlpha store assignment does not require real payment processing.",
      },
      {
        title: "Where can I see my orders?",
        text:
          "Open the account menu and select My orders, or visit the Orders page directly.",
      },
      {
        title: "Can I change cart quantities?",
        text:
          "Yes. Open your cart and use the plus and minus controls beside each item.",
      },
      {
        title: "What happens after checkout?",
        text:
          "The order is created in the backend, the cart is cleared, and an order number is shown on the confirmation screen.",
      },
    ],
  },

  privacy: {
    kicker: "Legal",
    title: "Privacy.",
    intro:
      "This page describes the basic data flow used by the NOVA demo store.",
    sections: [
      {
        title: "Account information",
        text:
          "The application uses account information needed for registration, authentication, orders, and cart ownership.",
      },
      {
        title: "Shopping data",
        text:
          "Products added to your cart and orders you place are stored by the store backend so they can persist between sessions.",
      },
      {
        title: "Authentication",
        text:
          "The frontend stores an authentication token in the browser and sends it with authenticated API requests.",
      },
    ],
  },

  terms: {
    kicker: "Legal",
    title: "Terms.",
    intro:
      "These terms describe the functionality of this NOVA demo store.",
    sections: [
      {
        title: "Store use",
        text:
          "NOVA is a demonstration e-commerce application built for the CodeAlpha project requirements.",
      },
      {
        title: "Orders",
        text:
          "Submitting checkout creates an order in the store backend. Order status may change as the order is processed.",
      },
      {
        title: "Payments",
        text:
          "This application does not process real online payments.",
      },
    ],
  },
};

function InfoPage() {
  const navigate = useNavigate();
  const { page } = useParams();

  const content = pageContent[page];

  if (!content) {
    return (
      <main className="info-page">
        <div className="info-not-found">
          <p className="section-kicker">
            Page not found
          </p>

          <h1>We couldn't find that page.</h1>

          <button
            type="button"
            className="button button-dark"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="info-page">
      <section className="info-header">
        <button
          type="button"
          className="back-to-info"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <p className="section-kicker">
          {content.kicker}
        </p>

        <h1>{content.title}</h1>

        <p>{content.intro}</p>
      </section>

      <section className="info-content">
        {content.sections.map((section) => (
          <article
            className="info-section"
            key={section.title}
          >
            <h2>{section.title}</h2>

            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default InfoPage;