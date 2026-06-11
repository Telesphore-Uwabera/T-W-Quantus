import { MongoClient, type Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!db) {
    const isProduction = process.env.NODE_ENV === "production";
    client = new MongoClient(uri, {
      connectTimeoutMS: isProduction ? 10000 : 3000,
      serverSelectionTimeoutMS: isProduction ? 10000 : 3000,
      socketTimeoutMS: isProduction ? 10000 : 3000,
      timeoutMS: isProduction ? 10000 : 3000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME ?? "TW-Quantus");
  }
  return db;
}

export async function initIndexes(): Promise<void> {
  try {
    const database = await getDb();
    await database.collection("subscriptions").createIndex({ email: 1 }, { unique: true });
    await database.collection("projects").createIndex({ slug: 1 }, { unique: true });
    await database.collection("projects").createIndex({ published: 1, sortOrder: 1, createdAt: -1 });
    await database.collection("contacts").createIndex({ createdAt: -1 });
    await database.collection("perspectives").createIndex({ slug: 1 }, { unique: true });
    await database.collection("perspectives").createIndex({ published: 1, sortOrder: 1, createdAt: -1 });
  } catch (e) {
    console.warn("[mongo] initIndexes:", e);
  }
}
