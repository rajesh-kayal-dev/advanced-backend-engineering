import express from "express";
import dotenv from "dotenv";
import Redis from "ioredis";
import connectDB from "./lib/db.js";
import User from "./models/user.model.js";
import reatLimiter from "./middleware/ratelimit.js";
import sendEmail from "./lib/sendEmail.js";
import emailQueue from "./queue.js";

dotenv.config()

const port = process.env.PORT || 6000;

const app = express();

const redis = new Redis(process.env.REDIS_URL);
export { redis };

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello From redis"
    });
});

app.post("/create", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await redis.del("user:all");

        const user = await User.create({
            name,
            email,
            password
        });

        // await sendEmail();
       await emailQueue.add("sendEmail", { email });

        return res.status(200).json({
            message: "Create route",
            user
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get("/get", reatLimiter, async (req, res) => {
    try {
        const user = await User.find({});
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get("/cache", async (req, res) => {

    const cachedData = await redis.get("user:all");

    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    const user = await User.find({});
    await redis.set("user:all", JSON.stringify(user));

    return res.json(user);
});

app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email}`, otp, "EX", 30); // OTP valid for 5 minutes

    return res.json({ otp });

});

app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    const cachedOtp = await redis.get(`otp:${email}`);

    if (!cachedOtp) {
        return res.status(400).json({ message: "OTP expired or not found" });
    }
    if (cachedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await redis.del(`otp:${email}`);


    return res.status(200).json({ message: "OTP verified successfully" });
});


const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();