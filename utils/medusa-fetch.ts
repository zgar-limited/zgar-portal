import { medusaSDK } from "./medusa";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  "pk_7bf9b3f0d739c9d6326a062f6d94db5c60e6dfec12a581cfe213cc3ca382d9ed";

interface MedusaFetchOptions extends RequestInit {
  query?: Record<string, string | number | boolean>;
}

export async function medusaFetch<T>(
  path: string,
  options: MedusaFetchOptions = {}
): Promise<T> {
  const { query, headers, ...restOptions } = options;

  let url = `${MEDUSA_BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;

  if (query) {
    const queryString = Object.entries(query)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
    url += `?${queryString}`;
  }

  // Get token from medusaSDK
  const token = await medusaSDK.client.getToken();

  const defaultHeaders: Record<string, string> = {
    "x-publishable-api-key": PUBLISHABLE_KEY,
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if body is not FormData
  if (!(restOptions.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...restOptions,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Medusa API Error: ${response.status} ${response.statusText} - ${
        errorData.message || JSON.stringify(errorData)
      }`
    );
  }

  return response.json();
}
