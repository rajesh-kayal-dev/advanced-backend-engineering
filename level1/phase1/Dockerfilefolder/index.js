import express from "express";
import dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT || 6000;

const app = express();

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello World"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});