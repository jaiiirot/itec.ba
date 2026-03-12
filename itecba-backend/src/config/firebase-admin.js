import admin from "firebase-admin";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Calculamos la ruta absoluta al archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(
  __dirname,
  "firebase-service-account.json",
);

// Leemos el archivo JSON de forma asíncrona
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"));

// Inicializamos Firebase Admin usando el JSON directamente
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const dbFirebase = admin.firestore();
export const authFirebase = admin.auth();

console.log("🟢 Firebase Admin Conectado Correctamente");
