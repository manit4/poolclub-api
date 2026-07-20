import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function randomBlock(length = 4) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return result;
}

function generateLicense() {
    return `PCM-${randomBlock()}-${randomBlock()}-${randomBlock()}`;
}

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    const secret = req.query.secret;

    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {

        let licenseKey;
        let exists = true;

        while (exists) {

            licenseKey = generateLicense();

            exists = await redis.get(
                `license:${licenseKey}`
            );

        }

        const license = {

            licenseKey,

            status: "active",

            activated: false,

            clubName: "",

            deviceId: "",

            createdAt: new Date().toISOString()

        };

        await redis.set(
            `license:${licenseKey}`,
            license
        );

        return res.status(200).json({

            success: true,

            licenseKey

        });

    }
    catch (e) {

        console.error(e);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

}