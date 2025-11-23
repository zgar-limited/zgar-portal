import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
}

export const medusaSDK = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: "pk_7bf9b3f0d739c9d6326a062f6d94db5c60e6dfec12a581cfe213cc3ca382d9ed",
});
