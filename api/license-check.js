import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });

    }

    try {

        const { licenseKey, deviceId } = req.query;

        if (!licenseKey || !deviceId) {

            return res.status(400).json({

                success: false,

                message: "License Key and Device ID required"

            });

        }

        const license = await redis.get(
            `license:${licenseKey}`
        );

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

        if (!license.activated) {

            return res.status(403).json({

                success: false,

                message: "License Not Activated"

            });

        }

        if (license.deviceId !== deviceId) {

            return res.status(403).json({

                success: false,

                message: "License belongs to another device"

            });

        }

        return res.status(200).json({

            success: true,

            message: "License Valid",

            clubName: license.clubName

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