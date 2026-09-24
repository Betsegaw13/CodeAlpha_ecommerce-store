import { apiRequest } from "./client";

export async function getCart() {
  return apiRequest("/cart/");
}

export async function addCartItem(productId, quantity = 1) {
  return apiRequest("/cart/items/", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });
}

export async function updateCartItem(itemId, quantity) {
  return apiRequest(`/cart/items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity,
    }),
  });
}

export async function removeCartItem(itemId) {
  return apiRequest(`/cart/items/${itemId}/`, {
    method: "DELETE",
  });
}