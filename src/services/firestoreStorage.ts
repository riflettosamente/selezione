import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
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
    // Assicuriamo metadati puliti e data salvataggio ad ogni singolo step
    const payload = {
      ...editionData,
      date: dateKey,
      syncedToFirestoreAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    const stepLabel = editionData.currentStep
      ? ` [Step ${editionData.currentStep}/${editionData.totalSteps || 13} - stato: ${editionData.status || "in_progress"}]`
      : ` [stato: ${editionData.status || "complete"}]`;
    console.log(`[Firestore] ✓ Edizione del ${dateKey} salvata su Firestore${stepLabel} (${editionData?.articles?.filter(Boolean).length || 0} articoli)`);
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

/**
 * Elimina una specifica edizione da Firestore.
 */
export async function deleteDailyEditionFromFirestore(dateKey: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, "daily_editions", dateKey);
    await deleteDoc(docRef);
    console.log(`[Firestore] 🗑️ Edizione ${dateKey} eliminata da Firestore (scaduta dopo 24 ore).`);
    return true;
  } catch (err: any) {
    console.error(`[Firestore] Errore eliminazione edizione ${dateKey}:`, err?.message || err);
    return false;
  }
}

/**
 * Pulisce automaticamente tutte le edizioni scadute su Firestore.
 * Conserva ESCLUSIVAMENTE l'edizione di oggi (dateKey corrente).
 * Tutte le date precedenti vengono rimosse per garantire la conservazione a sole 24 ore.
 */
export async function cleanupExpiredFirestoreEditions(currentDateKey?: string): Promise<{ deletedCount: number; keptDate: string }> {
  const db = getFirestoreDb();
  const keepDate = currentDateKey || new Date().toISOString().slice(0, 10);
  if (!db) return { deletedCount: 0, keptDate: keepDate };

  let deletedCount = 0;
  try {
    const colRef = collection(db, "daily_editions");
    const snap = await getDocs(colRef);
    
    for (const docSnap of snap.docs) {
      const docId = docSnap.id;
      // Se la data del documento è diversa da quella di oggi, è scaduta (> 24 ore) e va eliminata
      if (docId !== keepDate) {
        try {
          await deleteDoc(doc(db, "daily_editions", docId));
          deletedCount++;
          console.log(`[Firestore Pulizia] 🗑️ Rimossa edizione scaduta: ${docId}`);
        } catch (delErr) {
          console.warn(`[Firestore Pulizia] Errore cancellazione doc ${docId}:`, delErr);
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`[Firestore Pulizia 24h] Completata: eliminate ${deletedCount} edizioni scadute, conservata solo ${keepDate}.`);
    }
  } catch (err: any) {
    console.error("[Firestore Pulizia] Errore durante scansione edizioni:", err?.message || err);
  }

  return { deletedCount, keptDate: keepDate };
}
