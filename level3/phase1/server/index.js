import express from "express";
import dotenv from "dotenv";

dotenv.config()

const port = process.env.PORT || 6000;
const serverName = process.env.SERVER_NAME || "Unknown";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello From load balancer",
        server: serverName
    });
});

app.post("/create", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        return res.status(200).json({
            message: "User created",
            data: { name, email },
            server: serverName
        });
    } catch (error) {
        return res.status(500).json({ error: error.message, server: serverName });
    }
});

app.get("/get", async (req, res) => {
    try {
        return res.json({ message: "GET endpoint", server: serverName });
    } catch (error) {
        return res.status(500).json({ error: error.message, server: serverName });
    }
});








app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});