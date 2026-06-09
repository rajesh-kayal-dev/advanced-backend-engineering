import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 8002;

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello From Order Service"
    });
});

app.listen(port, () => {
    console.log(`Order Service Running On Port ${port}`);
});