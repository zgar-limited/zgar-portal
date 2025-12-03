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

  const defaultHeaders = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
  };

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
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
