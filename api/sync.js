import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });

    }

    try {

        await redis.set(
    "poolclub-status",
    JSON.stringify(req.body)
);

        return res.status(200).json({
            success: true,
            message: "Status synced successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

}