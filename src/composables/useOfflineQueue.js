import { openDB } from 'idb'

const DB = 'scanner-app'
const STORE = 'queue'

async function getDB() {
  return openDB(DB, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'timestamp' })
      }
    }
  })
}

export async function addToQueue(item) {
  const db = await getDB()
  await db.put(STORE, item)
}

export async function getQueue() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function clearQueue() {
  const db = await getDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.store.clear()
  await tx.done
}

export async function syncQueue() {
  const items = await getQueue()
  if (navigator.onLine && items.length) {
    console.log('Syncing items…', items)
    await new Promise(r => setTimeout(r, 1000))
    await clearQueue()
    console.log('Queue cleared.')
  }
}

window.addEventListener('online', syncQueue)