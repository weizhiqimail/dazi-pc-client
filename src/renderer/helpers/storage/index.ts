/** 读取有类型约束的本地偏好，值不存在或无效时返回默认值。 */
export function readStorageValue<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  const stored = localStorage.getItem(key) as T | null;
  return stored && allowed.includes(stored) ? stored : fallback;
}

/** 使用集中登记的键名持久化渲染层偏好。 */
export function writeStorageValue(key: string, value: string): void {
  localStorage.setItem(key, value);
}
