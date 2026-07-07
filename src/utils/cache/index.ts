type CacheValue = string | number | boolean | object | null

const CACHE_PREFIX = 'react-project'

function buildCacheKey(key: string): string {
  return `${CACHE_PREFIX}:${key}`
}

/** 读取本地缓存。 */
export function getCache<T extends CacheValue>(key: string): T | null {
  const rawValue = localStorage.getItem(buildCacheKey(key))

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  }
  catch {
    return rawValue as T
  }
}

/** 写入本地缓存。 */
export function setCache(key: string, value: CacheValue): void {
  localStorage.setItem(buildCacheKey(key), JSON.stringify(value))
}

/** 移除本地缓存。 */
export function removeCache(key: string): void {
  localStorage.removeItem(buildCacheKey(key))
}

export function getCacheToken(): string | null {
  return getCache<string>('TOKEN')
}

export function setCacheToken(token: string): void {
  setCache('TOKEN', token)
}

export function removeCacheToken(): void {
  removeCache('TOKEN')
}

export function getCacheRefreshToken(): string | null {
  return getCache<string>('REFRESH_TOKEN')
}

export function setCacheRefreshToken(token: string): void {
  setCache('REFRESH_TOKEN', token)
}

export function removeCacheRefreshToken(): void {
  removeCache('REFRESH_TOKEN')
}

export function getCacheTenantId(): string | null {
  return getCache<string>('TENANT_ID')
}

export function setCacheTenantId(tenantId: string): void {
  setCache('TENANT_ID', tenantId)
}

export function removeCacheTenantId(): void {
  removeCache('TENANT_ID')
}

/** 清理登录相关缓存。 */
export function clearAuthCache(): void {
  removeCacheToken()
  removeCacheRefreshToken()
  removeCacheTenantId()
  removeCache('IS_LOGGED_IN')
}
