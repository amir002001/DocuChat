import * as dotenv from 'dotenv'
import { readFileSync } from 'fs';
import { readdir } from 'fs/promises';
import { relative, resolve } from 'path';
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
const summarize_text = (text: string) => {
    co.summarize({ text: text, length: 'long', format: 'bullets' })
}

const vectorize_file = (file_path: string): number[] => {
    const file_content = readFileSync(file_path, { encoding: 'utf8', flag: 'r' })
    console.log(file_content)
    return []
}

const check_if_id_exists = async (id: string): Promise<boolean> => {
    const index = pinecone?.Index("docs")
    if (!index) return false
    const res = await index.fetch({ ids: [id] })
    const vector = res?.vectors?.[id]
    return vector == undefined
}

const process_docs = async ({ doc_path, ignore }: { doc_path: string, ignore: string[] }) => {
    const ignore_set = new Set(ignore)
    for await (const file of getFiles("./docs")) {
        if (!ignore_set.has(file.file_name)) {
            const relative_path = relative(file.file_path, __dirname)
            if (await check_if_id_exists(relative_path))
                vectorize_file(file.file_path)
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
