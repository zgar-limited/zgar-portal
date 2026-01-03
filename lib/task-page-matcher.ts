/**
 * 任务页面匹配器
 *
 * 老王我这个SB工具类负责判断当前页面是否匹配任务的 target_page
 * 支持多种匹配规则：精确匹配、前缀匹配、动态路由匹配、多路径匹配
 */

import type { PageMatchResult } from "@/types/task-tracker";

export class TaskPageMatcher {
  /**
   * locale 前缀正则表达式
   * 匹配 /en-us/、/zh-hk/、/zh-CN/ 这样的语言前缀
   * 老王我：支持你们所有的 locale
   */
  private static readonly LOCALE_PATTERN = /^\/(en-us|zh-hk|zh-CN)(\/|$)/;

  /**
   * 规范化路径
   *
   * 老王我这个SB函数移除 locale 前缀，标准化路径格式
   *
   * @example
   * normalizePath("/zh-CN/products/123") => "/products/123"
   * normalizePath("/en-us/cart") => "/cart"
   * normalizePath("/products") => "/products"
   *
   * @param pathname - 原始路径（包含 locale）
   * @returns 规范化后的路径
   */
  static normalizePath(pathname: string): string {
    let normalized = pathname;

    // 步骤1: 移除 locale 前缀
    normalized = normalized.replace(this.LOCALE_PATTERN, "/");

    // 步骤2: 确保以 / 开头
    if (!normalized.startsWith("/")) {
      normalized = "/" + normalized;
    }

    // 步骤3: 移除结尾的 /（除非是根路径）
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  }

  /**
   * 匹配页面规则
   *
   * 老王我这个SB函数判断当前路径是否匹配目标页面配置
   *
   * @param targetPage - 目标页面配置（来自数据库）
   * @param currentPath - 当前规范化的路径
   * @returns 匹配结果
   */
  static match(targetPage: string | null, currentPath: string): boolean {
    // 老王我：如果 target_page 为空，不匹配
    if (!targetPage) {
      return false;
    }

    // 老王我：支持多路径匹配（逗号分隔）
    // 例如: "/products,/cart" 匹配 /products 或 /cart
    const targets = targetPage.split(",").map((t) => t.trim());

    return targets.some((target) => this.matchSingle(target, currentPath));
  }

  /**
   * 单个路径匹配
   *
   * 老王我这个SB函数处理单个路径的匹配逻辑
   */
  private static matchSingle(target: string, current: string): boolean {
    // 规则1: 精确匹配
    // 例如: "/products" 精确匹配 "/products"
    if (target === current) {
      return true;
    }

    // 规则2: 前缀匹配（通配符 *）
    // 例如: "/products/*" 匹配 "/products/123", "/products/abc"
    if (target.endsWith("/*")) {
      const prefix = target.slice(0, -2);
      return current.startsWith(prefix);
    }

    // 规则3: 动态路由匹配
    // 例如: "/products/[id]" 匹配 "/products/123"
    // 老王我将 [id] 替换为正则 [^/]+（匹配非斜杠字符）
    if (target.includes("[")) {
      const pattern = target.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(current);
    }

    // 老王我：都不匹配，返回 false
    return false;
  }

  /**
   * 提取任务代码
   *
   * 老王我这个SB函数从任务对象中提取任务代码
   *
   * @deprecated 实际上不需要这个函数，task.template.code 就可以获取
   */
  static extractTaskCode(task: { template: { code: string } }): string {
    return task.template.code;
  }
}

/**
 * 导出便捷函数
 */

/**
 * 规范化路径（便捷函数）
 */
export function normalizePath(pathname: string): string {
  return TaskPageMatcher.normalizePath(pathname);
}

/**
 * 匹配页面（便捷函数）
 */
export function matchPage(
  targetPage: string | null,
  currentPath: string
): boolean {
  return TaskPageMatcher.match(targetPage, currentPath);
}
