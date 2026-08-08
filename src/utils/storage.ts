/**
 * storage.ts — IndexedDB 封装
 *
 * 用于缓存 AI 模型文件（200MB ONNX 文件），避免每次刷新都重新下载。
 * 提供三个核心操作：存储、读取、清空。
 *
 * 数据库结构：
 *   DB: watermark-eraser (v1)
 *   ObjectStore: models (key-value，key 为模型名，value 为 ArrayBuffer)
 *
 * 为什么用 IndexedDB 而不是 localStorage？
 *   - localStorage 上限 ~5MB，ONNX 模型文件 200MB
 *   - IndexedDB 支持存储大型二进制数据（Blob/ArrayBuffer）
 *   - 异步 API，不阻塞主线程
 */

const DB_NAME = 'watermark-eraser';
const DB_VERSION = 1;
const MODEL_STORE = 'models';

/**
 * 打开 IndexedDB 数据库连接
 * 首次访问时自动创建 objectStore
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // 数据库版本升级时创建存储空间
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MODEL_STORE)) {
        db.createObjectStore(MODEL_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 缓存模型文件到 IndexedDB
 * @param name 模型标识（如 'lama-model-v1'）
 * @param buffer 模型文件的 ArrayBuffer
 */
export async function cacheModel(name: string, buffer: ArrayBuffer): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MODEL_STORE, 'readwrite');
    const store = tx.objectStore(MODEL_STORE);
    store.put(buffer, name);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * 从 IndexedDB 读取已缓存的模型文件
 * @param name 模型标识
 * @returns 缓存的 ArrayBuffer，或 null（未缓存）
 */
export async function getCachedModel(name: string): Promise<ArrayBuffer | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MODEL_STORE, 'readonly');
    const store = tx.objectStore(MODEL_STORE);
    const request = store.get(name);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 清空所有缓存的模型文件
 */
export async function clearCache(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MODEL_STORE, 'readwrite');
    const store = tx.objectStore(MODEL_STORE);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * 检测 IndexedDB 是否可用（用于浏览器兼容性检测）
 */
export async function checkIndexedDBAvailable(): Promise<boolean> {
  try {
    await openDB();
    return true;
  } catch {
    return false;
  }
}