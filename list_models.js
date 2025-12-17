import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAr8puyhKv6w6aB7-17XtxHLT_C64Z9-IE";

async function listModels() {
    try {
        // The SDK might not expose listModels directly on the main class easily in all versions, 
        // but let's try a standard fetch if the SDK method isn't obvious or try the SDK method if known.
        // Actually, looking at docs, typically one might iterate or it's not always exposed in the high level GoogleGenerativeAI helper if not instantiated with a minimal client.
        // Let's try to just hit the REST endpoint to be sure, or use the SDK's model listing if available.
        // Simpler: Just try 'gemini-pro' and 'gemini-1.5-flash' as fallbacks in a test.

        // But let's try to verify via a simple fetch which is more robust than guessing SDK surface area.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models returned or error:", data);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
