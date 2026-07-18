import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
    return res.status(200).end();
}

    try {

       const data = await redis.get("poolclub-status");

if (!data) {

    return res.status(200).json({
        success: true,
        message: "No data available",
        businessRunning: false
    });

}

return res.status(200).json({
    success: true,
    ...data
});

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

}