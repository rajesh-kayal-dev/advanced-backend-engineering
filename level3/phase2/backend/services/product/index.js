import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 8003;

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello From Product Service"
    });
});

app.listen(port, () => {
    console.log(`Product Service Running On Port ${port}`);
});