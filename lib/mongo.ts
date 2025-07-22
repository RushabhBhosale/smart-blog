import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri);
const db = client.db("blog_db");

export const blogCollection = db.collection("blogs");

await client.connect();
