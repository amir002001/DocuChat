import type { NextApiRequest, NextApiResponse } from "next";
import { PineconeClient } from "@pinecone-database/pinecone";
import co from "cohere-ai";
type Source = {
  url: string;
  name: string;
};

type ChatResult = {
  response: string;
  sources: Source[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResult>
) {
  if (req.method == "POST") {
    const body = req.body as { query: string };
    co.init(process.env.COHERE_KEY ?? "");
    const cohere_response = await co.embed({ texts: [body.query] });
    const pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.PINECONE_KEY ?? "",
      environment: "us-east1-gcp",
    });
    const pinecone_result = await pinecone.Index("docs").query({
      queryRequest: { vector: cohere_response.body.embeddings[0], topK: 3 },
    });
    const sources = pinecone_result.matches?.map((match): Source => {
      return { url: match.id, name: "" };
    });
    if (!sources) return;
    const stop_yelling: ChatResult = {
      response: "",
      sources: sources,
    };
    res.status(200).json(stop_yelling);
  } else {
    res.status(404).end();
  }
}
