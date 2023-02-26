import * as dotenv from 'dotenv'
import { readFileSync } from 'fs';
import { readdir } from 'fs/promises';
import { basename, relative, resolve } from 'path';
dotenv.config()
import { init_pinecone_client, co, pinecone } from "./clients"

async function* getFiles(dir: string): AsyncGenerator<{ file_name: string, file_path: string }, boolean, unknown> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield { file_name: dirent.name, file_path: res };
        }
    }
    return true
}
const summarize_text = async (text: string) => {
    const summary = await co.summarize({ text: text, length: 'long', format: 'bullets' })
    return summary.body.summary
}
const embed_text = async (text: string) => {
    const vector = await co.embed({ model: "large", texts: [text] })
    return vector.body.embeddings[0]
}
const embed_file = async (file_path: string): Promise<number[]> => {
    const file_content = readFileSync(file_path, { encoding: 'utf8', flag: 'r' })
    console.log("getting file summary")
    const summary = await summarize_text(file_content)
    console.log("getting vector")
    const vector = await embed_text(summary)
    return vector
}

const check_if_id_not_upserted = async (id: string): Promise<boolean> => {
    console.log("checking if ID already upserted")
    const index = pinecone?.Index("docs")
    if (!index) return false
    const res = await index.fetch({ ids: [id] })
    const vector = res?.vectors?.[id]
    return vector == undefined
}

const upsert_vector = async ({ id, vector }: { id: string, vector: number[] }): Promise<boolean> => {
    console.log(`upserting vector: ${id}`)
    if (!pinecone)
        return false
    const index = pinecone.Index("docs")
    if (!index) return false
    await index.upsert({ upsertRequest: { vectors: [{ id: id, values: vector }] } })
    return true
}

const process_docs = async ({ doc_path, ignore }: { doc_path: string, ignore: string[] }) => {
    const ignore_set = new Set(ignore)
    for await (const file of getFiles("./docs")) {
        if (!ignore_set.has(file.file_name)) {
            const relative_path = relative(file.file_path, __dirname)
            if (await check_if_id_not_upserted(relative_path)) {
                console.log("id not upserted")
                const vector = await embed_file(file.file_path)
                await upsert_vector({ id: file.file_name, vector: vector })
            }
        }
    }
}

const main = async () => {
    await init_pinecone_client()
    if (!pinecone)
        return
    const indexes = await pinecone.listIndexes()
    if (!indexes.includes("docs")) {
        console.log("index does not exist. attempting to create")
        pinecone.createIndex({ createRequest: { name: "docs", podType: "s1", metric: "cosine", dimension: 4096 } })
    } else {
        console.log("index exists")
    }
    process_docs({
        doc_path: "docs", ignore: ["index.md", "changelog.md"]
    })
}

main()
