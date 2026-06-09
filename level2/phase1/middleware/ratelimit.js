import { redis } from "../index.js";


const reatLimiter = async (req, res, next) => {
    const ip = req.ip;

    const key = `ratelimit:${ip}`;

    const request = await redis.get(key);

    if (request == 1) {
        await redis.set(key, 1, "EX", 60);
    }

    if (request > 5) {
        return res.status(429).json({ message: "Too many requests" });
    }
    next();
}

export default reatLimiter;
