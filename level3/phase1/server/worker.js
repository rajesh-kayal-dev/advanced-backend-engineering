import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import sendEmail from "./server/lib/sendEmail.js";

dotenv.config();


const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const worker = new Worker("emailQueue", async (job) => {
    console.log("job received");
    const email = job.data.email;
    await sendEmail(email);
    console.log(`Email sent to ${email}`);
    console.log("job completed");

}, { connection: redis });

