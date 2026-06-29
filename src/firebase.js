import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCVaymrHdpWDd2InNqN7FPprdu4XeiRPxQ",
  authDomain: "helaly-moving.firebaseapp.com",
  databaseURL: "https://helaly-moving-default-rtdb.firebaseio.com",
  projectId: "helaly-moving",
  storageBucket: "helaly-moving.firebasestorage.app",
  messagingSenderId: "397372911442",
  appId: "1:397372911442:web:e7e9e6fd3a0236680c948b",
  measurementId: "G-6TEMT17R6X"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Suppress offline warnings in console
if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  console.warn = (...args) => {
    const msg = args[0]?.toString() || ''
    // Filter out Firebase offline warnings
    if (msg.includes('Could not reach Cloud Firestore backend') || 
        msg.includes('offline mode')) {
      return
    }
    originalWarn.apply(console, args)
  }
}

const SITE_DOC = 'hilaly-moving/site'

// Load all site data from Firestore
export async function loadSiteData() {
  // Skip Firebase if not available (local dev without internet)
  try {
    const snap = await getDoc(doc(db, 'hilaly-moving', 'site'))
    if (snap.exists()) return deserialize(snap.data())
    return null
  } catch (e) {
    // Fallback to localStorage or default CMS - silent fail
    return null
  }
}

// Remove undefined values and flatten nested arrays — Firestore doesn't support nested arrays
function sanitize(obj) {
  return JSON.parse(JSON.stringify(obj, (key, val) => {
    if (val === undefined) return null
    // Convert nested arrays to objects: [['label', 'value'], ...] → [{k: 'label', v: 'value'}, ...]
    if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) {
      return val.map(item => Array.isArray(item) ? { k: item[0], v: item[1] } : item)
    }
    return val
  }))
}

// Restore nested arrays after loading from Firestore
function deserialize(obj) {
  return JSON.parse(JSON.stringify(obj, (key, val) => {
    // Restore stats format: [{k, v}, ...] → [[k, v], ...]
    if (key === 'stats' && Array.isArray(val) && val.length > 0 && val[0]?.k !== undefined) {
      return val.map(item => [item.k, item.v])
    }
    return val
  }))
}

// Save all site data to Firestore
export async function saveSiteData(content, video) {
  try {
    // Strip video src if it's a large base64 string (>1MB) — Firestore has 1MB doc limit
    const safeVideo = { ...video }
    if (safeVideo.src && safeVideo.src.startsWith('data:') && safeVideo.src.length > 500000) {
      safeVideo.src = '' // base64 too large for Firestore — use a URL instead
      console.warn('Video base64 too large for Firestore — cleared. Use a URL link instead.')
    }

    // Audit trail
    let updatedBy = 'unknown'
    try {
      const { getAuth } = await import('firebase/auth')
      const user = getAuth().currentUser
      if (user) updatedBy = user.email || user.uid
    } catch {}

    await setDoc(doc(db, 'hilaly-moving', 'site'), sanitize({
      content,
      video: safeVideo,
      updatedAt: new Date().toISOString(),
      updatedBy,
    }))
    return true
  } catch (e) {
    console.error('Firestore save error:', e.code, e.message)
    return false
  }
}


