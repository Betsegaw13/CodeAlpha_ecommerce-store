import { apiRequest } from "./client";

export async function registerUser(userData) {
  return apiRequest("/auth/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(credentials) {
  return apiRequest("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser() {
  return apiRequest("/auth/logout/", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me/");
}