import { PineconeClient } from "@pinecone-database/pinecone";
import cohere from "cohere-ai";

export let pinecone: null | PineconeClient = null
cohere.init(process.env.COHERE_API_KEY ?? "")
export { cohere as co }

export const init_pinecone_client = async () => {
    if (pinecone)
        return
    const pinecone_baby = new PineconeClient();
    await pinecone_baby.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? "",
        apiKey: process.env.PINECONE_API_KEY ?? "",
    });
    pinecone = pinecone_baby
}

