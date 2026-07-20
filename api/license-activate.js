import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });

    }

    try {

        const {

            licenseKey,
            clubName,
            deviceId

        } = req.body;

        if (!licenseKey || !deviceId) {

            return res.status(400).json({

                success: false,

                message: "License Key and Device ID required"

            });

        }

        const redisKey = `license:${licenseKey}`;

        const license = await redis.get(redisKey);

        if (!license) {

            return res.status(404).json({

                success: false,

                message: "Invalid License"

            });

        }

        if (license.status !== "active") {

            return res.status(403).json({

                success: false,

                message: "License Disabled"

            });

        }

        if (license.activated === true) {

            return res.status(409).json({

                success: false,

                message: "License already activated",

                deviceId: license.deviceId

            });

        }

        license.activated = true;

        license.deviceId = deviceId;

        license.clubName = clubName || "";

        license.activatedAt = new Date().toISOString();

        await redis.set(redisKey, license);

        return res.status(200).json({

            success: true,

            message: "License Activated"

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