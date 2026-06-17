import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || process.argv[2];
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || process.argv[3] || "TW-Quantus";

async function createIndexes() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Usage: npm run create-indexes <mongodb-uri> <database-name>");
    console.error("Or set MONGODB_URI environment variable");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    console.log("Connected to MongoDB");

    // Create indexes for projects collection
    const projectsCollection = db.collection("projects");
    try {
      await projectsCollection.createIndex({ published: 1 }, { name: "published_1" });
      console.log("Created index: published_1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: published_1");
      else throw e;
    }
    try {
      await projectsCollection.createIndex({ slug: 1 }, { name: "slug_1", unique: true });
      console.log("Created index: slug_1 (unique)");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: slug_1");
      else throw e;
    }
    try {
      await projectsCollection.createIndex({ sortOrder: 1 }, { name: "sortOrder_1" });
      console.log("Created index: sortOrder_1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: sortOrder_1");
      else throw e;
    }
    try {
      await projectsCollection.createIndex({ createdAt: -1 }, { name: "createdAt_-1" });
      console.log("Created index: createdAt_-1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: createdAt_-1");
      else throw e;
    }
    try {
      await projectsCollection.createIndex({ published: 1, sortOrder: 1, createdAt: -1 }, { name: "published_1_sortOrder_1_createdAt_-1" });
      console.log("Created index: published_1_sortOrder_1_createdAt_-1");
    } catch (e: any) {
      if (e.code === 86 || e.code === 85) console.log("Index already exists with same keys: published_1_sortOrder_1_createdAt_-1");
      else throw e;
    }
    console.log("Completed indexes for projects collection");

    // Create indexes for perspectives collection
    const perspectivesCollection = db.collection("perspectives");
    try {
      await perspectivesCollection.createIndex({ published: 1 }, { name: "published_1" });
      console.log("Created index: published_1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: published_1");
      else throw e;
    }
    try {
      await perspectivesCollection.createIndex({ slug: 1 }, { name: "slug_1", unique: true });
      console.log("Created index: slug_1 (unique)");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: slug_1");
      else throw e;
    }
    try {
      await perspectivesCollection.createIndex({ date: -1 }, { name: "date_-1" });
      console.log("Created index: date_-1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: date_-1");
      else throw e;
    }
    try {
      await perspectivesCollection.createIndex({ createdAt: -1 }, { name: "createdAt_-1" });
      console.log("Created index: createdAt_-1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: createdAt_-1");
      else throw e;
    }
    try {
      await perspectivesCollection.createIndex({ published: 1, date: -1 }, { name: "published_date" });
      console.log("Created index: published_date");
    } catch (e: any) {
      if (e.code === 86 || e.code === 85) console.log("Index already exists with same keys: published_date");
      else throw e;
    }
    console.log("Completed indexes for perspectives collection");

    // Create indexes for news collection (if it exists)
    const newsCollection = db.collection("news");
    try {
      await newsCollection.createIndex({ published: 1 }, { name: "published_1" });
      console.log("Created index: published_1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: published_1");
      else throw e;
    }
    try {
      await newsCollection.createIndex({ slug: 1 }, { name: "slug_1", unique: true });
      console.log("Created index: slug_1 (unique)");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: slug_1");
      else throw e;
    }
    try {
      await newsCollection.createIndex({ date: -1 }, { name: "date_-1" });
      console.log("Created index: date_-1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: date_-1");
      else throw e;
    }
    try {
      await newsCollection.createIndex({ createdAt: -1 }, { name: "createdAt_-1" });
      console.log("Created index: createdAt_-1");
    } catch (e: any) {
      if (e.code === 86) console.log("Index already exists: createdAt_-1");
      else throw e;
    }
    console.log("Completed indexes for news collection");

    console.log("All indexes created/verified successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createIndexes();
