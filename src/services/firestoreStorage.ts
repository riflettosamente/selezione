import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import fs from "fs";
import path from "path";

let dbInstance: Firestore | null = null;
let isInitialized = false;

export function getFirestoreDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  if (isInitialized) return null; // already tried and failed

  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(configPath)) {
      console.warn("[Firestore] File firebase-applet-config.json non trovato, storage Firestore disabilitato.");
      isInitialized = true;
      return null;
    }

    const rawConfig = fs.readFileSync(configPath, "utf-8");
    const firebaseConfig = JSON.parse(rawConfig);

    const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
    dbInstance = getFirestore(app, databaseId);
    isInitialized = true;
    console.log(`[Firestore] Connesso con successo al database: ${databaseId}`);
    return dbInstance;
  } catch (err: any) {
    console.error("[Firestore] Errore inizializzazione Firestore:", err?.message || err);
    isInitialized = true;
    return null;
  }
}

/**
 * Salva l'intera edizione quotidiana su Firestore nella collection 'daily_editions'.
 * Il docId è la data 'YYYY-MM-DD'.
 */
export async function saveDailyEditionToFirestore(dateKey: string, editionData: any): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, "daily_editions", dateKey);
    // Assicuriamo metadati puliti e data salvataggio
    const payload = {
      ...editionData,
      date: dateKey,
      syncedToFirestoreAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] ✓ Edizione del ${dateKey} salvata permanentemente su Firestore!`);
    return true;
  } catch (err: any) {
    console.error(`[Firestore] Errore salvataggio edizione ${dateKey}:`, err?.message || err);
    return false;
  }
}

/**
 * Carica l'edizione quotidiana da Firestore.
 */
export async function loadDailyEditionFromFirestore(dateKey: string): Promise<any | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, "daily_editions", dateKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      console.log(`[Firestore] ✓ Recuperata edizione ${dateKey} da Firestore (${data?.articles?.length || 0} articoli).`);
      return data;
    }
    return null;
  } catch (err: any) {
    console.error(`[Firestore] Errore lettura edizione ${dateKey}:`, err?.message || err);
    return null;
  }
}
