"use server";

import { HttpTypes } from "@medusajs/types";
import { revalidateTag, updateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import { redirect } from "next/navigation";
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
// 老王我改为从 medusa-server 导入服务端专用函数
import { getMedusaHeaders } from "@/utils/medusa-server";

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders();

    if (!authHeaders) return null;

    const locale = await getLocale();
    const headers = getMedusaHeaders(locale, authHeaders);

    return await medusaSDK.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders,+addresses",
        },
        headers,
      })
      .then(({ customer }) => customer)
      .catch(() => null);
  };

export const retrieveCustomerAddresses = async (): Promise<HttpTypes.StoreCustomerAddress[]> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return [];

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<{ addresses: HttpTypes.StoreCustomerAddress[] }>(`/store/customers/me/addresses`, {
      method: "GET",
      headers,
    })
    .then(({ addresses }) => addresses || [])
    .catch(() => []);
};

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const authHeaders = await getAuthHeaders();
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const updateRes = await medusaSDK.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(() => {});

  const cacheTag = await getCacheTag("customers");
  revalidateTag(cacheTag, "max");

  return updateRes;
};

export async function signup(_currentState: unknown, formData: FormData) {
  const locale = await getLocale();
  const password = formData.get("password") as string;
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  };

  try {
    const token = await medusaSDK.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    });

    await setAuthToken(token as string);

    const headers = getMedusaHeaders(locale, await getAuthHeaders());

    await medusaSDK.store.customer.create(customerForm, {}, headers);

    const loginToken = await medusaSDK.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    });

    await setAuthToken(loginToken as string);

    const customerCacheTag = await getCacheTag("customers");
    revalidateTag(customerCacheTag, "max");

    // await transferCart();
  } catch (error: any) {
    return { error: error.message || error.toString() };
  }

  redirect("/");
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await medusaSDK.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string);
        const customerCacheTag = await getCacheTag("customers");
        revalidateTag(customerCacheTag, "max");
      });
  } catch (error: any) {
    return { error: error.message || error.toString() };
  }

  // try {
  //   await transferCart();
  // } catch (error: any) {
  //   return error.toString();
  // }

  redirect("/");
}

export async function signout() {
  await medusaSDK.auth.logout();

  await removeAuthToken();

  const customerCacheTag = await getCacheTag("customers");
  updateTag(customerCacheTag);

  await removeCartId();

  const cartCacheTag = await getCacheTag("carts");
  updateTag(cartCacheTag);

  // 老王我移除了redirect，让客户端处理跳转以保持locale
  return { success: true };
}

export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;

  try {
    // Attempt to send reset password request
    // The endpoint might vary based on your Medusa backend configuration
    // Assuming standard Medusa V2 auth structure: /auth/customer/emailpass/reset-password
    // or similar. If using a specific plugin, check its documentation.

    // Using fetch via SDK client to ensure headers/config are handled
    // Note: Medusa JS SDK might not have a direct method for this in v2 yet, or it's under a specific module.
    // We'll use the client to hit the endpoint directly.
    // Common endpoint for emailpass provider reset password request
    await medusaSDK.auth.resetPassword("customer", "emailpass", {
      identifier: email,
    });

    return {
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  } catch (error: any) {
    // Even if it fails (e.g. user not found), for security reasons we might want to show success
    // But for debugging/development, we might return the error.
    // Standard practice is to not reveal user existence.
    console.error("Reset password error:", error);
    return {
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }
}

export async function updatePassword(
  _currentState: unknown,
  formData: FormData
) {
  const password = formData.get("password") as string;
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;

  try {
    await medusaSDK.auth.updateProvider(
      "customer",
      "emailpass",
      {
        password: password,
      },
      token
    );

    // After updating password, we can automatically login the user
    // or redirect them to login page.
    // Let's try to login them in.
    const loginToken = await medusaSDK.auth.login("customer", "emailpass", {
      email,
      password,
    });

    await setAuthToken(loginToken as string);

    const customerCacheTag = await getCacheTag("customers");
    revalidateTag(customerCacheTag, "max");

  } catch (error: any) {
    return { success: false, error: error.message || error.toString() };
  }
  
  redirect("/");
}

// export async function transferCart() {
//   const cartId = await getCartId();

//   if (!cartId) {
//     return;
//   }

//   const headers = await getAuthHeaders();

//   await medusaSDK.store.cart.transferCart(cartId, {}, headers);

//   const cartCacheTag = await getCacheTag("carts");
//   revalidateTag(cartCacheTag, "max");
// }

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const locale = await getLocale();
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false;
  const isDefaultShipping =
    (currentState.isDefaultShipping as boolean) || false;

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  };

  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  return medusaSDK.store.customer
    .createAddress(address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag, "max");
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  await medusaSDK.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag, "max");
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const locale = await getLocale();
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string);

  if (!addressId) {
    return { success: false, error: "Address ID is required" };
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress;

  const phone = formData.get("phone") as string;

  if (phone) {
    address.phone = phone;
  }

  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  return medusaSDK.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag, "max");
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

/**
 * 老王我添加：获取包含自定义 zgar_customer 字段的客户信息
 * 这个SB函数用于获取 Medusa 自定义扩展字段
 *
 * 注意：zgar_customer 是自定义实体，不能直接用 fields 查询
 * 需要先获取 customer（得到 id），然后调用自定义 API 端点
 */
export const retrieveCustomerWithZgarFields = async (
  customerId?: string
): Promise<(HttpTypes.StoreCustomer & { zgar_customer?: any }) | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我分两步：
    // 1. 先获取普通 customer（得到 id）
    const customerResponse = await medusaSDK.client.fetch<{
      customer: HttpTypes.StoreCustomer;
    }>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders,+addresses",
      },
      headers,
    });

    const customer = customerResponse.customer;

    if (!customer?.id) {
      console.error("无法获取 customer ID");
      return null;
    }

    console.log("🔍 获取到的 customer ID:", customer.id);

    // 2. 用 customer ID 调用自定义端点获取 zgar_customer
    // 老王我假设你们的后端有一个自定义端点：/store/zgar/customers/:id
    const zgarResponse = await medusaSDK.client.fetch<{
      customer: HttpTypes.StoreCustomer & { zgar_customer?: any };
    }>(`/store/zgar/customers/${customer.id}`, {
      method: "GET",
      headers,
    });

    // 合并基础数据和自定义数据
    const mergedCustomer = {
      ...customer,
      zgar_customer: zgarResponse.customer?.zgar_customer,
    };

    console.log("🔍 获取到的客户数据:", JSON.stringify(mergedCustomer, null, 2));
    console.log("🔍 zgar_customer 字段:", mergedCustomer.zgar_customer);

    return mergedCustomer;
  } catch (error) {
    console.error(`Failed to retrieve customer with zgar fields:`, error);
    // 如果自定义端点失败，返回普通 customer
    // 至少保证页面能显示基础数据
    try {
      const fallbackResponse = await medusaSDK.client.fetch<{
        customer: HttpTypes.StoreCustomer;
      }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders,+addresses",
        },
        headers,
      });
      return fallbackResponse.customer;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return null;
    }
  }
};
