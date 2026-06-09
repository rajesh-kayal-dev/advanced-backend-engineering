import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello From Auth Service"
    });
});

app.listen(port, () => {
    console.log(`Auth Service Running On Port ${port}`);
});