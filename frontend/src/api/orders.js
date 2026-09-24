import { apiRequest } from "./client";

export async function checkoutOrder(orderData) {
  return apiRequest("/orders/checkout/", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrders() {
  return apiRequest("/orders/");
}

export async function getOrder(orderNumber) {
  return apiRequest(`/orders/${orderNumber}/`);
}