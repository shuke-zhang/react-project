type CacheValue = string | number | boolean | object | null

const CACHE_PREFIX = 'react-project'

function buildCacheKey(key: string): string {
  return `${CACHE_PREFIX}:${key}`
}

/**
 * 读取带项目命名空间的本地缓存。
 *
 * @param key 业务缓存键，不需要包含项目前缀。
 * @returns 解析后的缓存值；不存在时返回 `null`。
 */
export function getCache<T extends CacheValue>(key: string): T | null {
  const rawValue = localStorage.getItem(buildCacheKey(key))

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  }
  catch {
    // 兼容历史上直接写入字符串的缓存值，避免 JSON 解析失败导致会话读取中断。
    return rawValue as T
  }
}

/**
 * 写入带项目命名空间的本地缓存。
 *
 * @param key 业务缓存键，不需要包含项目前缀。
 * @param value 要写入的可序列化缓存值。
 */
export function setCache(key: string, value: CacheValue): void {
  localStorage.setItem(buildCacheKey(key), JSON.stringify(value))
}

/**
 * 移除带项目命名空间的本地缓存。
 *
 * @param key 业务缓存键，不需要包含项目前缀。
 */
export function removeCache(key: string): void {
  localStorage.removeItem(buildCacheKey(key))
}

/**
 * 读取当前登录会话的访问令牌缓存。
 *
 * @returns 访问令牌；不存在时返回 `null`。
 */
export function getCacheToken(): string | null {
  return getCache<string>('TOKEN')
}

/**
 * 写入当前登录会话的访问令牌缓存。
 *
 * @param token 访问令牌。
 */
export function setCacheToken(token: string): void {
  setCache('TOKEN', token)
}

/**
 * 移除当前登录会话的访问令牌缓存。
 */
export function removeCacheToken(): void {
  removeCache('TOKEN')
}

/**
 * 读取当前登录会话的刷新令牌缓存。
 *
 * @returns 刷新令牌；不存在时返回 `null`。
 */
export function getCacheRefreshToken(): string | null {
  return getCache<string>('REFRESH_TOKEN')
}

/**
 * 写入当前登录会话的刷新令牌缓存。
 *
 * @param token 刷新令牌。
 */
export function setCacheRefreshToken(token: string): void {
  setCache('REFRESH_TOKEN', token)
}

/**
 * 移除当前登录会话的刷新令牌缓存。
 */
export function removeCacheRefreshToken(): void {
  removeCache('REFRESH_TOKEN')
}

/**
 * 读取当前登录会话的租户 ID 缓存。
 *
 * @returns 租户 ID；不存在时返回 `null`。
 */
export function getCacheTenantId(): string | null {
  return getCache<string>('TENANT_ID')
}

/**
 * 写入当前登录会话的租户 ID 缓存。
 *
 * @param tenantId 租户 ID。
 */
export function setCacheTenantId(tenantId: string): void {
  setCache('TENANT_ID', tenantId)
}

/**
 * 移除当前登录会话的租户 ID 缓存。
 */
export function removeCacheTenantId(): void {
  removeCache('TENANT_ID')
}

/**
 * 清理登录会话相关的所有本地缓存。
 *
 * 退出登录和登录会话过期时都应通过该函数统一清理，避免残留访问令牌。
 */
export function clearAuthCache(): void {
  removeCacheToken()
  removeCacheRefreshToken()
  removeCacheTenantId()
  removeCache('IS_LOGGED_IN')
}
