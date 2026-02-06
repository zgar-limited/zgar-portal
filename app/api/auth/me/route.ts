import { NextResponse } from "next/server";
import { retrieveCustomer } from "@/data/customer";

/**
 * 检查当前用户登录状态的API
 * 老王我搞这个API是因为httpOnly的cookie客户端读不到
 */
export async function GET() {
  try {
    const customer = await retrieveCustomer();

    return NextResponse.json({
      isLoggedIn: !!customer,
      customer: customer || null,
    });
  } catch (error) {
    console.error("Failed to check auth status:", error);
    return NextResponse.json(
      { isLoggedIn: false, customer: null },
      { status: 200 }
    );
  }
}
