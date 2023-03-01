import type { NextApiRequest, NextApiResponse } from 'next'
import { PineconeClient } from '@pinecone-database/pinecone'
import co from 'cohere-ai'
type Source = {
    url: string
    name: string
}

export type ChatResult = {
    sources: Source[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChatResult>
) {
    if (req.method == 'POST') {
        const body = req.body as { query: string }
        co.init(process.env.COHERE_KEY ?? '')
        const cohere_response = await co.embed({ texts: [body.query] })
        const pinecone = new PineconeClient()
        await pinecone.init({
            apiKey: process.env.PINECONE_KEY ?? '',
            environment: 'us-east1-gcp',
        })
        const pinecone_result = await pinecone.Index('docs').query({
            queryRequest: {
                vector: cohere_response.body.embeddings[0],
                topK: 10,
            },
        })
        if (!pinecone_result.matches) {
            res.status(400).end()
            return
        }
        const decent_matches = pinecone_result.matches.filter(
            (match) => (match.score ?? 0) > 0.5
        )
        const sources: Source[] = []

        const doc_base = 'https://github.com/github/docs/blob/main/content/'
        for (const match of decent_matches) {
            const url = doc_base + match.id
            console.log(match.score)
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
