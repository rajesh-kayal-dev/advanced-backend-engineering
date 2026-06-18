import express from "express";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq"
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";



dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;


const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    maxRetries: 2
})

const embeddings = new JinaEmbeddings({
    apiKey: process.env.JINA_API_KEY,
    model: "jina-embeddings-v3",
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "grocery-store",
});


const upload = async () => {
    try {
        const buffer = fs.readFileSync("./knowlaege.pdf");

        const parser = new PDFParse({
            data: buffer,
        });

        const result = await parser.getText();

        const text = result.text;

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ["\n\n", "\n", " ", ""]
        })
        const docs = await splitter.createDocuments(
            [text],
            [
                {
                    source: "knowlaege.pdf",
                    type: "grocery",
                },
            ]
        );

        await vectorStore.addDocuments(docs);

        await parser.destroy();
    } catch (error) {
        console.error(error);
    }
};


// upload();

app.post("/", async (req, res) => {
    try {
        const { input } = req.body

        const docs = await vectorStore.similaritySearch(input, 3);
        const context = docs.map((doc) => doc.pageContent).join("\n");

        const response = await llm.invoke([
            new SystemMessage(`You are a RAG AI assistant.

                        STRICT RULES:
                            - Answer ONLY from context
                            - Do not use outside knowledge
                            - If answer not found say:
                            "I don't know from uploaded PDF."
                        Context: ${context}`),

            new HumanMessage(`Answer the user's question.
                        Question: ${input}`),
        ])



        return res.status(200).json({ ai: response.content })
    } catch (error) {
        console.error(error);
    }
})







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});