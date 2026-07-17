import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default async function handler(req, res) {

    try {

        const connection = await clientPromise;

        const db = connection.db("poolclub");

        const collections = await db.listCollections().toArray();

        res.status(200).json({
            success: true,
            message: "MongoDB Connected Successfully",
            database: db.databaseName,
            collections: collections.length
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

}