import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAr8puyhKv6w6aB7-17XtxHLT_C64Z9-IE";

async function testKey() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
        const prompt = "Say 'The key matches' if you can read this.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success:", text);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

testKey();
