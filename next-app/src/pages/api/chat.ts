import type { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from '@pinecone-database/pinecone'
import co from 'cohere-ai'
type Source = {
    url: string
    name: string
}
export type ChatResult = { sources: Source[] }
type ChatError = { error: string }
type ChatResponse = ChatResult | ChatError

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChatResponse>
) {
    if (req.method == 'POST') {
        const body = req.body as { query: string }
        let cohere_response = null
        try {
            co.init(process.env.COHERE_KEY ?? '')
            cohere_response = await co.embed({ texts: [body.query] })
        } catch {}
        if (!cohere_response) {
            res.status(400).json({ error: 'error getting embedding' })
            return
        }
        const pinecone = new PineconeClient()
        let pinecone_result = null
        try {
            await pinecone.init({
                apiKey: process.env.PINECONE_KEY ?? '',
                environment: 'us-east1-gcp',
            })
            pinecone_result = await pinecone.Index('docs').query({
                queryRequest: {
                    vector: cohere_response.body.embeddings[0],
                    topK: 10,
                },
            })
        } catch {
            res.status(400).json({ error: 'error querying index' })
            return
        }
        if (!pinecone_result.matches) {
            res.status(400).json({ error: 'matches do not exist' })
            return
        }
        const decent_matches = pinecone_result.matches.filter(
            (match) => (match.score ?? 0) > 0.5
        )
        const sources: Source[] = []

        const doc_base = 'https://github.com/github/docs/blob/main/content/'
        for (const match of decent_matches) {
            const url = doc_base + match.id
            const name = match.id
                .split('/')
                .at(-1)
                ?.replace('.md', '')
                .replace(/-/g, ' ')
            sources.push({ url: url, name: name ?? 'doc name' })
        }
        res.status(200).json({ sources: sources })
    } else {
        res.status(404).end()
    }
}
