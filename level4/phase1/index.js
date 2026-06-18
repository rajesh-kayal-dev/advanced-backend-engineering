import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChatGroq } from "@langchain/groq"
import { Annotation, MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";


dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

/*
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})

app.post("/ai", async (req, res) => {
    try {
        const { input } = req.body
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: input,
            config: {
                systemInstruction: "you are a assistant and your name is jarvis.if you don't know the answer then don't give incorrect answer"
            }
        })

        return res.status(200).json({ ai: response.text })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to generate content" })
    }
})
*/





/** State */

const state = Annotation.Root({
    prompt: Annotation,
    aiMsg: Annotation
})


/** Tools */
// WebSearch Tool
const tool = new TavilySearch({
    maxResults: 5,
    topic: "general",
});

const tools = [tool]

const toolNode = new ToolNode(tools)


/** LangChain */
const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    maxRetries: 2
}).bindTools(tools);




const callLlm = async (state) => {
    console.log("state", state)

    const response = await llm.invoke([
        {
            role: "system",
            content: `you are a assistant and your name is JARVIS
            if you don't know the answer then don't give incorrect answer`
        },
        ...state.messages
    ])

    return { messages: [response] }
}

/** Memory */

const checkPointer = new MemorySaver();

const shouldContinue = async (state) => {
    const lastMessage = state.messages[state.messages.length - 1]

    if (lastMessage.tool_calls?.length > 0) {
        return "tools"
    } else {
        return "__end__"
    }
}

/** LangGraph */

const graph = new StateGraph(MessagesAnnotation)
    .addNode("agent", callLlm)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .compile({ checkpointer: checkPointer })





app.post("/", async (req, res) => {
    try {
        const { input } = req.body

        const response = await graph.invoke(
            { messages: [{ role: "user", content: input }] },
            { configurable: { thread_id: "user_123" } }
        )

        return res.status(200).json({ ai: response.messages[response.messages.length - 1].content })
    } catch (error) {
        console.error(error);
    }
})







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});