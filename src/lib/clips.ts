// Video clips live in IndexedDB (too big for localStorage). Every call fails soft: history still works without the video.
const DB = "vuelo-clips", STORE = "clips";

const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open(DB, 1);
  r.onupgradeneeded = () => r.result.createObjectStore(STORE);
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});

async function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((res, rej) => {
    const req = f(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => { db.close(); res(req.result); };
    req.onerror = () => { db.close(); rej(req.error); };
  });
}

export const saveClip = async (id: string, blob: Blob): Promise<boolean> => { try { await tx("readwrite", (s) => s.put(blob, id)); return true; } catch { return false; } };
export const getClip = async (id: string): Promise<Blob | null> => { try { return (await tx<Blob | undefined>("readonly", (s) => s.get(id))) ?? null; } catch { return null; } };
export const deleteClip = async (id: string): Promise<void> => { try { await tx("readwrite", (s) => s.delete(id)); } catch { /* nothing to do */ } };
