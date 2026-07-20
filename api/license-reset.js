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

            licenseKey

        } = req.body;

        if (!licenseKey) {

            return res.status(400).json({

                success: false,

                message: "License Key Required"

            });

        }

        const redisKey = `license:${licenseKey}`;

        const license = await redis.get(redisKey);

        if (!license) {

            return res.status(404).json({

                success: false,

                message: "License Not Found"

            });

        }

        license.activated = false;

        license.deviceId = "";

        license.clubName = "";

        license.activatedAt = "";

        await redis.set(redisKey, license);

        return res.status(200).json({

            success: true,

            message: "License Reset Successfully"

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