import { apiRequest } from "./client";

export async function getProducts() {
  return apiRequest("/products/");
}

export async function getCategories() {
  return apiRequest("/categories/");
}

export async function getProduct(id) {
  return apiRequest(`/products/${id}/`);
}