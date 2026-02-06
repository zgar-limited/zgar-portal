/**
 * API Route: 获取客户端 IP 地址
 *
 * 这个 API Route 在服务端运行，可以读取请求头获取真实客户端 IP
 */

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getClientIPFromHeaders } from '@/utils/client-ip';

export async function GET() {
  try {
    // 获取请求头
    const headersList = headers();

    // 从请求头中提取客户端 IP
    const ip = getClientIPFromHeaders(headersList);

    // 返回 IP 地址
    return NextResponse.json({ ip });
  } catch (error) {
    console.error('[API] 获取客户端IP失败:', error);
    return NextResponse.json({ ip: '0.0.0.0' }, { status: 200 });
  }
}
