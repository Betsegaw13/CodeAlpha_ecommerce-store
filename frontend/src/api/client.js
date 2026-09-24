import { API_BASE_URL } from "../config";
import { getAuthToken } from "./authStorage";

function formatApiError(data) {
  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return String(data.detail);
  }

  if (data.message) {
    return String(data.message);
  }

  if (data.error) {
    return String(data.error);
  }

  /*
   * Django REST Framework commonly returns validation
   * errors like:
   *
   * {
   *   "shipping_address": ["This field is required."]
   * }
   *
   * Convert them into a readable message.
   */
  if (typeof data === "object") {
    const messages = [];

    for (const [field, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        messages.push(
          `${field}: ${value.join(", ")}`,
        );
      } else if (typeof value === "object" && value !== null) {
        messages.push(
          `${field}: ${JSON.stringify(value)}`,
        );
      } else {
        messages.push(`${field}: ${value}`);
      }
    }

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return "Something went wrong. Please try again.";
}

export async function apiRequest(
  endpoint,
  options = {},
) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
}